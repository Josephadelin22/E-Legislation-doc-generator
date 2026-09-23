import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { TemplateRegistryService } from '@/core/services/template-registry.servicies';
import { WorkflowStateService } from '@/core/services/workflow-state.services';
import { TemplateDefintion, CategorieActe } from '@/core/models/template-definition.model';


@Component({
  imports: [CommonModule,FormsModule],
  selector: 'app-template-selection',
  styleUrl: './template-selection.component.css',
  templateUrl: './template-selection.component.html',
})
export class TemplateSelectionComponent {
  private readonly templateRegistry = inject(TemplateRegistryService);
  private readonly worflowService = inject(WorkflowStateService);

  readonly allTemplates = toSignal(this.templateRegistry.getTemplates(), { initialValue: []});
  
  readonly searchQuery = signal('');
  readonly selectedCategory = signal<string>('Tous');

  readonly categories: string[] = [
    'Tous',
    'Arrete',
    'Decret',
    'Loi Organique',
    'Loi Ordinaire',
    'Ordonnance',
    'Constitution',
    'Autre'


  ];

  readonly filteredTemplates = computed(() => {
  const list = this.allTemplates();
  const query = this.searchQuery().toLowerCase().trim();
  const cat = this.selectedCategory();

  return list.filter(template => {
    // Si la saisie est vide ou correspond à "tous" / "tout", on ne filtre pas par texte
    const isWildcardAll = !query || query === 'tous' || query === 'tout';

    const matchQuery =
      isWildcardAll ||
      template.title.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query) ||
      template.category.toLowerCase().includes(query) ||
      template.code.toLowerCase().includes(query);

    const matchCat = cat === 'Tous' || template.category === cat;
    return matchQuery && matchCat;
  });
});

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);

  }
  setCategory(category: string): void {
    this.searchQuery.set(category);
  }
  chooseTemplate(template: TemplateDefintion): void {
    this.worflowService.selectTemplate(template);
  }
}
