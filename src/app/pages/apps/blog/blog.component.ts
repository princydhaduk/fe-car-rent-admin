import { ToastrService } from 'ngx-toastr';
import { Component, Inject, Optional, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreService } from 'src/app/services/core.service';
import { MatSort } from '@angular/material/sort';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AddBlogComponent } from './add-blog/add-blog.component';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;
  indexNo: any[] = [];
  index: number;
  carForm!: FormGroup;
  filteredItems: any[] = [];
  filterData: any;
  filteredData: any[];
  formData: any[];
  currentDate: string;
  displayedColumns: any = [
    'id',
    'heading',
    'details',
    'date',
    'action',
  ];
  dataSource: any = [];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(public dialog: MatDialog, public datePipe: DatePipe, private formBuilder: FormBuilder, private setting: CoreService, private http: HttpClient, private toastr:ToastrService,) {
    this.filteredItems = this.dataSource?.slice();
  }

  ngAfterViewInit(): void {
    // debugger
    this.dataSource = new MatTableDataSource(this.dataSource);
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getBlogDisplay();
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string): void {

    if (filterValue === '') {
      this.dataSource = this.filterData;
    } else {
      this.dataSource = this.dataSource.filter((ele: any) => ele.model.includes(filterValue.trim().toLowerCase()));
    }
    // console.log("data::-->>", this.dataSource);
  }


  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(BlogDialogComponent , {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.addRowData(result.data);
      } else if (result.event === 'Update') {
        this.updateRowData(result.data);
      }
    });
  }

  addRowData(row_obj:any): void {
    this.dialog.open(AddBlogComponent);
    this.getBlogDisplay();
  }

  updateRowData(element:any): void {
    const payload = {
        "bloag_id": element._id,
        "heading": element.heading,
        "Image":  element?.fileToUpload?.name || element.img,
        "details": element.details,
    }
    this.setting.setBlogUpdate(payload).subscribe((res:any) => {
      if(res.message){
        this.toastr.success(res.message);
      }
      console.log("update::::",this.dataSource);
      this.getBlogDisplay();
    });
  }

  deleteRecords(element:any): void {
    this.http.post('http://localhost:5000/api/deleteBlog',{bloag_id: element._id}).subscribe((res:any) => {
      if(res.message){
        this.toastr.success(res.message);
      }
      this.getBlogDisplay();
    });
  }

  getBlogDisplay() {
    this.setting.getBlogs().subscribe((data: any) => {
      if (data) {
        data.forEach((ele: any, index: number) => {
          ele['id'] = index + 1;
          ele['img'] = ele.Image;
        });
        this.currentDate = data[0].createdAt;
        this.dataSource = data;
        this.filterData = data;
        this.dataSource = data;
        // console.log("res-data === ", data);
      }
    });
  }
}

@Component({
  selector: 'app-blog-dialog',
  templateUrl: './blog-dialog.component.html',
  // styleUrls: ['./blog-dialog.component.scss']
})
export class BlogDialogComponent implements OnInit {
  action: string;
  local_data: any;
  selectedImage: any = '';
  joiningDate: any = '';
  blogForm!: FormGroup;
  imagePath: File;
  fileToUpload: any;
  imageUrl: any;

  constructor(
    private formBuilder: FormBuilder,
    private setting: CoreService,
    private toastr:ToastrService,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<BlogDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    if (this.local_data.DateOfJoining !== undefined) {
      this.joiningDate = this.datePipe.transform(
        new Date(this.local_data.DateOfJoining),
        'yyyy-MM-dd',
      );
    }
    if (this.local_data.img === undefined) {
      this.local_data.img = '../../../../assets/car-images/toy-car.jpg';
    }
  }

  ngOnInit(): void {
    this.blogForm = this.formBuilder.group({
      heading: ['', Validators.required],
      details: ['', Validators.required],
    });
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: {...this.local_data, fileToUpload: this.fileToUpload} });
    
    if(this.action === "Add") {
      const payload = {
        "heading": this.blogForm.value.heading,
        "Image": this.fileToUpload.name,
        "details": this.blogForm.value.details,
      }
      // console.log("payload--->>",payload);
      
      this.setting.setBlog(payload).subscribe((res: any) => {
        if (res) {
          this.toastr.success(res.message);
        }
        else{
          this.toastr.error("Somthing want worng, Try agin...");
        }
        // this.getCarDisplay();
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  selectFile(file: any): void {
    this.fileToUpload = file.target.files.item(0);
    console.log(this.fileToUpload);

    // debugger
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
    console.log("fileupload::---", this.fileToUpload);
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.blogForm.controls[controlName].hasError(errorName);
  }

  // get priceControl(){
  //   return this.carForm.get('price');
  // }
}
