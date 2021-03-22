import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { FormsRoutingModule } from './forms-routing.module';
import { HomeComponent } from './home/home.component';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { SliderComponent , DeleteYesSupportDialog } from './slider/slider.component';
import { InputsComponent,DeleteSupportDialog, EditSupportDialog } from './inputs/inputs.component';
// import { OtherComponent,DeactiveUserActivityHistoryDialog, EditDeActiveUserDialog, DeActiveHistoryWithdrawDialog, 
//    DeActiveUserDailyScratchHistoryDialog, DeActiveUserDailyTaskSpinDialog, DeActiveUserApplicationDialog, DeActiveUserMoreDialog  } from './other/other.component';
import { StatesGroupComponent } from './auto-complete/states-group/states-group.component';
import { SelectedValueComponent } from './datepicker/selected-value/selected-value.component';
import { MatButtonModule } from '@angular/material/button';

import { Url } from 'src/api/api.url';
import { QueryService } from 'src/api/query/query.service';
import { UserService } from 'src/api/user/user.service';
import { PaymentService } from 'src/api/withdraw/withdraw.service';



@NgModule({
  imports: [
    SharedModule,
    MatDialogModule,
    FormsRoutingModule,
    FormModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSliderModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  declarations: [
    HomeComponent,
    AutoCompleteComponent,
    DatepickerComponent,
    CheckboxComponent,
    SliderComponent,
    DeleteYesSupportDialog,
    InputsComponent,
    DeleteSupportDialog,
    EditSupportDialog,
    // OtherComponent,
    // DeactiveUserActivityHistoryDialog,
    // DeActiveUserDailyTaskSpinDialog,
    // EditDeActiveUserDialog,
    // DeActiveHistoryWithdrawDialog,
    // DeActiveUserDailyScratchHistoryDialog,
    // DeActiveUserApplicationDialog,
    // DeActiveUserMoreDialog,
    StatesGroupComponent,
    SelectedValueComponent
  ],
  providers: [Url, UserService, PaymentService , QueryService]
})
export class SupportModule { }
