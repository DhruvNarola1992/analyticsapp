import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ScratchService } from "src/api/scratch/scratch.service";
@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss']
})
export class OtherComponent implements OnInit {
  form: FormGroup;  
  @ViewChild('fileUploader') fileUploader:ElementRef;
  constructor(private formBuilder:FormBuilder,private scratchService:ScratchService) {}
  ngOnInit() {
    this.form = this.formBuilder.group({
      totalCard: '',
      selectcoin: '',
      scratchpic: [null]
    })
  }
  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      scratchpic: file
    });
    this.form.get('scratchpic').updateValueAndValidity()
  }
  async submitScratch(){
    var formData: any = new FormData();
    formData.append("totalCard", this.form.get('totalCard').value);
    formData.append("coin", this.form.get('selectcoin').value);
    formData.append("scratchpic", this.form.get('scratchpic').value);
    var responseData = await this.scratchService.addScratch(formData);
    if(responseData.code == 1) {

    } else {

    }
    this.clearForm();
  }
  async clearForm(){
    this.form.patchValue({
      totalCard: '',
      selectcoin: '',
      scratchpic: [null]
    });
    this.fileUploader.nativeElement.value = null;
  }
}
