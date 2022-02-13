import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { JobTitle } from 'src/app/Models/JobTitle';
import { debounceTime , distinctUntilChanged, switchMap } from 'rxjs/operators';
import { JobTitleService } from '../Services/JobTitle/job-title.service';

@Component({
  selector: 'app-job-title',
  templateUrl: './job-title.component.html',
  styleUrls: ['./job-title.component.scss']
})
export class JobTitleComponent implements OnInit ,OnChanges{

  lsJobTitlesIsVivible:boolean;
  lsJobTitle$: Observable<JobTitle[]>;
  description = new Subject<string>();
  txtJobTitle = new FormControl('');

  jobTitleSelected: JobTitle = null;
  @Input('jobTitleSelected')
  set setJobTitleSelected(jobTitle:JobTitle){
    this.jobTitleSelected = jobTitle;
    if(!this.jobTitleSelected){
      this.txtJobTitle.reset()
    }
  }

  isFormDisable: boolean = false;
  @Input('isFormDisable')
  set setIsFormDisable(value:boolean){
    this.isFormDisable = value;
    this.enableOrDisbaleField(this.isFormDisable)
  }

  constructor(
    private jobTitleService:JobTitleService
  ) { }

  ngOnInit(): void {
    this.initComponents();
  }

  ngOnChanges(changes: SimpleChanges) {
    for(let change in changes){
      if(change == "jobTitleSelected")
      {
        let job = this.jobTitleService.getJobTitleSelected();
        if(job == null){
          this.txtJobTitle.setValue("");
        }else{


          this.setJobTitleInInput(job);
        }

      }
    }
  }

  enableOrDisbaleField(isFormBlocked:boolean){
    if(isFormBlocked){
      this.txtJobTitle.disable()
    }else{
      this.txtJobTitle.enable()
    }

  }

  async initComponents(){

    this.jobTitleSelected = this.jobTitleService.getJobTitleSelected();

    if(this.jobTitleSelected == null){
      this.jobTitleSelected = new JobTitle();
      this.jobTitleSelected.description = '';
      this.lsJobTitlesIsVivible = true;
    }else{
      this.setJobTitleInInput(this.jobTitleSelected);
    }

    this.lsJobTitle$ = this.description.pipe(
      debounceTime(300),//await 300 ms to send other search
      distinctUntilChanged(), //Avoid if the term is equals to the term before
      switchMap( (desc: string) => this.jobTitleService.getJobTitlesByDescription(desc)
      )
    )
  }

  getJobtitleByDescription(description:string){
    this.description.next(description);
    this.lsJobTitlesIsVivible = true;
    this.setJobTitleFromInput();
    this.jobTitleService.setJobTitleSelected(null);
  }

  setJobTitleInInput(jobTitle:JobTitle){
    this.jobTitleSelected = jobTitle;
    this.lsJobTitlesIsVivible = false;
    this.jobTitleService.setJobTitleSelected(jobTitle);
  }

  setJobTitleFromInput(){
    let jobtitle = new JobTitle();
    jobtitle.id = 0;
    jobtitle.description = this.txtJobTitle.value;
    this.jobTitleService.setJobTitleByInput(jobtitle);
  }
}
