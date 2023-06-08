import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  TuiButtonModule,
  TuiDialogModule,
  TuiErrorModule,
  TuiNotificationModule,
  TuiRootModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';

import { HttpClientModule } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TUI_DIALOG_CLOSES_ON_BACK, TuiLetModule } from '@taiga-ui/cdk';
import { TUI_FRENCH_LANGUAGE, TUI_LANGUAGE } from '@taiga-ui/i18n';
import {
  TuiAvatarModule,
  TuiHighlightModule,
  TuiInputModule,
  TuiInputPasswordModule,
  TuiIslandModule,
  TuiProgressModule,
} from '@taiga-ui/kit';
import { of } from 'rxjs';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { JobOffersComponent } from './pages/job-offers/job-offers.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FilterIgnoreCaseLikePipe } from './pipes/filter.pipe';
import { provideAuthService } from './services/auth.service';
import { SavedJobOffersComponent } from './pages/saved-job-offers/saved-job-offers.component';

@NgModule({
  declarations: [
    AppComponent,

    RegisterComponent,
    JobOffersComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    FilterIgnoreCaseLikePipe,
    SavedJobOffersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    TuiRootModule,
    TuiIslandModule,
    TuiInputModule,
    TuiInputPasswordModule,
    TuiTextfieldControllerModule,
    TuiButtonModule,
    TuiSvgModule,
    TuiErrorModule,
    TuiAvatarModule,
    TuiHighlightModule,
    TuiTableModule,
    TuiLetModule,
    TuiDialogModule,
    TuiProgressModule,
    TuiNotificationModule,
  ],
  providers: [
    provideAuthService(),
    {
      provide: TUI_LANGUAGE,
      useValue: of(TUI_FRENCH_LANGUAGE),
    },
    {
      provide: TUI_DIALOG_CLOSES_ON_BACK,
      useValue: of(true),
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
