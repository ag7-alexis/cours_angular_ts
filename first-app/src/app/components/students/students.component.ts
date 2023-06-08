import { Component } from '@angular/core';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent {
  private x =
    'https://pole-emploi.io/data/api/explorateur-metiers-version-beta?tabgroup-api=documentation&doc-section=api-doc-section-caracteristiques';
}
