import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NotifyService } from "src/api/notify/notify.service";
@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss']
})
export class OtherComponent implements OnInit {

  form: FormGroup;

  @ViewChild('fileUploader') fileUploader:ElementRef;
    
  constructor(private formBuilder:FormBuilder, private notifyService:NotifyService) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: '',
      text: '',
      pic: [null]
    })
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
        pic: file
    });
    this.form.get('pic').updateValueAndValidity()
  }


  async submitNotification() {
    var formData: any = new FormData();
    formData.append("title", this.form.get('title').value);
    formData.append("text", this.form.get('text').value);
    formData.append("pic", this.form.get('pic').value);
    var responseData = await this.notifyService.addNotification(formData);
    if(responseData.code == 1) {

    } else {

    }
    this.clearForm();
  }

  async clearForm(){
    this.form.patchValue({
      title: '',
      text: '',
      pic: [null]
    });
    this.fileUploader.nativeElement.value = null;
  }
}
