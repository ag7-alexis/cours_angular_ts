import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable, from, map, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import {
  JobOffer,
  JobOffersResponse,
  JobProfessionDetails,
  JobProfessionResponse,
  JobProfessionsResponse,
  SavedJobOffer,
} from './jobs.services.types';

@Injectable()
export class JobsService {
  private readonly savedJobServiceCollection;
  constructor(
    private readonly http: HttpClient,
    private readonly store: Firestore,
    private readonly authService: AuthService
  ) {
    this.savedJobServiceCollection = collection(this.store, 'savedJobOffers');
  }

  retrieveProfessions(): Observable<string[]> {
    return this.http
      .get<JobProfessionsResponse>(
        'https://labonnealternance.apprentissage.beta.gouv.fr/api/V1/metiers/all'
      )
      .pipe(map((r) => r.metiers));
  }

  retrieveProfession(profession: string): Observable<JobProfessionDetails> {
    return this.http
      .get<JobProfessionResponse>(
        `https://labonnealternance.apprentissage.beta.gouv.fr/api/V1/metiers?title=${profession}`
      )
      .pipe(map((r) => r.labelsAndRomes[0]));
  }

  retrieveJobOffers(romes: string[]): Observable<JobOffer[]> {
    const url = new URL(
      'https://labonnealternance.apprentissage.beta.gouv.fr/api/V1/jobs'
    );
    url.searchParams.append('caller', 'emploi-paul');
    url.searchParams.append('romes', romes.join(','));
    url.searchParams.append('sources', 'offres');

    return this.http
      .get<JobOffersResponse>(url.toString())
      .pipe(map((r) => r.peJobs.results));
  }

  createSavedJobOffer(savedJobOffer: Partial<SavedJobOffer>) {
    return this.authService.user$.pipe(
      switchMap((u) => {
        const document = {
          ...savedJobOffer,
          userUid: u?.uid,
          jobOffer: JSON.stringify(savedJobOffer.jobOffer),
        };

        return addDoc(this.savedJobServiceCollection, document);
      })
    );
  }

  getSavedJobOffer(): Observable<SavedJobOffer[]> {
    return this.authService.user$.pipe(
      switchMap((u) => {
        if (u === null) {
          return [];
        }
        const q = query(
          this.savedJobServiceCollection,
          where('userUid', '==', u.uid)
        );
        return collectionData(q, { idField: 'id' }).pipe(
          map((ds) => {
            return ds.map(
              (d): SavedJobOffer => ({
                commentary: d['commentary'],
                userUid: d['userUid'],
                jobOffer: JSON.parse(d['jobOffer']),
                id: d['id'],
              })
            );
          })
        );
      })
    );
  }

  deleteSavedJobOffer(savedJobOfferId: string) {
    const document = doc(this.store, 'savedJobOffers', savedJobOfferId);

    return from(deleteDoc(document));
  }
}
