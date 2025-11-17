import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

// ✅ Import form-js CSS
import '@bpmn-io/form-js/dist/assets/form-js.css';

@Component({
  selector: 'app-camunda-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="camunda-form-wrapper">
      <div #formContainer class="camunda-form-container"></div>

      <button
        *ngIf="camundaForm"
        class="submit-btn"
        type="button"
        (click)="onSubmit()"
      >
        Submit
      </button>
    </div>
  `,
  styles: [`
    .camunda-form-wrapper {
      padding: 16px;
      border-radius: 8px;
      background: #f7f9fb;
    }

    .camunda-form-container {
      min-height: 200px;
    }

    .submit-btn {
      margin-top: 16px;
      background: #0062ff;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      cursor: pointer;
    }

    .submit-btn:hover {
      background: #004bb5;
    }
  `]
})
export class CamundaFormComponent implements AfterViewInit, OnChanges {
  @Input() userTaskKey!: string;
  @ViewChild('formContainer', { static: false }) formContainer?: ElementRef<HTMLDivElement>;

  camundaForm?: any;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    if (this.userTaskKey) {
      this.loadCamundaForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userTaskKey'] && !changes['userTaskKey'].firstChange) {
      this.loadCamundaForm();
    }
  }

  /** Load and render the form schema + prefill variables */
  private async loadCamundaForm() {
    if (!this.formContainer?.nativeElement || !this.userTaskKey) {
      console.warn('⏳ Waiting for form container or userTaskKey...');
      return;
    }

    try {
      const formResponse = await firstValueFrom(
        this.http.get<{ schema: any; variables: Record<string, any> }>(
          `http://localhost:3000/${this.userTaskKey}/form`
        )
      );

      if (!formResponse?.schema) {
        console.error('❌ No schema found for this task');
        return;
      }

      console.log('✅ Form built successfully with variables:', formResponse.variables);

      // Normalize and flatten variables
      const normalizedVars = this.normalizeVariables(formResponse.variables);
      const flattenedVars = this.flattenVariables(normalizedVars);

      console.log('✅ Flattened variables:', flattenedVars);

      // Clean container
      this.formContainer.nativeElement.innerHTML = '';

      // Dynamic import to avoid require issues
      const { Form } = await import('@bpmn-io/form-js');

      const formInstance = new Form({
        container: this.formContainer.nativeElement
      });

      // Import schema
      // Import schema
        await formInstance.importSchema(formResponse.schema);

        // Populate form data
        try {
          const flattenedVars = this.flattenVariables(this.normalizeVariables(formResponse.variables));

          if (typeof (formInstance as any).importData === 'function') {
            console.log('📥 Using importData() to populate form');
            await (formInstance as any).importData(flattenedVars);
          } else if (typeof (formInstance as any).setProperty === 'function') {
            console.log('📥 Using setProperty("data") to populate form');
            await (formInstance as any).setProperty('data', flattenedVars);
          } else {
            console.warn('⚠️ No supported method found to set form data');
          }
        } catch (err) {
          console.error('❌ Failed to inject form data:', err);
}


      this.camundaForm = formInstance;
      console.log(`✅ Form rendered successfully for userTaskKey: ${this.userTaskKey}`);
    } catch (err) {
      console.error('❌ Failed to load Camunda form:', err);
    }
  }

  /** Handle submission */
  async onSubmit() {
    if (!this.camundaForm) return;

    try {
      const { data, errors } = await this.camundaForm.submit();

      if (errors?.length) {
        console.warn('⚠️ Validation errors:', errors);
        return;
      }

      console.log('✅ Form data submitted:', data);

      await firstValueFrom(
        this.http.post(`http://localhost:3000/${this.userTaskKey}/submit`, {
          variables: data
        })
      );

      console.log('🚀 Form data submitted successfully');
    } catch (err) {
      console.error('❌ Submission failed:', err);
    }
  }

  /** Normalize JSON string variables into objects and remove extra quotes */
  private normalizeVariables(vars: Record<string, any>): Record<string, any> {
    const normalized: Record<string, any> = {};
    Object.keys(vars || {}).forEach((k) => {
      try {
        let val = vars[k];
        if (typeof val === 'string') {
          val = val.trim();
          if ((val.startsWith('{') && val.endsWith('}')) || (val.startsWith('[') && val.endsWith(']'))) {
            val = JSON.parse(val);
          } else if (/^".*"$/.test(val)) {
            val = val.slice(1, -1); // remove extra quotes
          }
        }
        normalized[k] = val;
      } catch {
        normalized[k] = vars[k];
      }
    });
    return normalized;
  }

  /** Flatten nested variables like { selectedPolicy: { companyName: 'Allianz' } } */
  private flattenVariables(obj: any, prefix = '', result: any = {}): Record<string, any> {
    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        this.flattenVariables(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }
    return result;
  }
}
