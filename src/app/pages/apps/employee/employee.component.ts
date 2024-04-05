import { ToastrService } from 'ngx-toastr';
import { Component, Inject, Optional, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AppAddEmployeeComponent } from './add/add.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreService } from 'src/app/services/core.service';
import { MatSort } from '@angular/material/sort';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  templateUrl: './employee.component.html',
})
export class AppEmployeeComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;
  indexNo: any[] = [];
  index: number;
  carForm!: FormGroup;
  filteredItems: any[] = [];
  filterData: any;
  filteredData: any[];
  formData: any[];
  displayedColumns: any = [
    'id',
    'plate_number',
    'model',
    'brand',
    'price',
    'description',
    'mileage',
    'ac',
    'seats',
    'luggage',
    'fuel',
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
    this.getCarDisplay();
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
    const dialogRef = this.dialog.open(AppEmployeeDialogContentComponent, {
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
    this.dialog.open(AppAddEmployeeComponent);
    this.getCarDisplay();
  }

  updateRowData(element:any): void {
    const payload = {
        "plate_number": element.plate_number,
        "Image":  element?.fileToUpload?.name || element.img,
        "price": element.price,
        "model": element.model,
        "brand": element.brand,
        "description" : element.description,
        "mileage": element.mileage,
        "Air_Conditioning_Availability": element.ac,
        "seats": element.seats,
        "leggage": element.leggage,
        "fuel": element.fuel,
    }
    this.setting.setCarUpdate(payload).subscribe((res:any) => {
      if(res.message){
        this.toastr.success(res.message);
      }
      console.log("update::::",this.dataSource);
      this.getCarDisplay();
    })
  }

  deleteRecords(element:any): void {
    debugger
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    });
    const options = {
      headers
    };
    this.http.post('http://localhost:5000/api/cardelete',{plate_number: element.plate_number},options).subscribe((res:any) => {
      if(res.message){
        this.toastr.success(res.message);
        this.getCarDisplay();
      }
    });
  }

  getCarDisplay() {
    this.setting.getCar().subscribe((data: any) => {
      if (data) {
        data.forEach((ele: any, index: number) => {
          ele['id'] = index + 1;
          ele['img'] = ele.Image;
        });
        this.dataSource = data;
        this.filterData = data;
        this.dataSource = data;
        // console.log("res-data === ", data);
      }

    });
  }
}

@Component({
  selector: 'app-dialog-content',
  templateUrl: 'employee-dialog-content.html',
})
export class AppEmployeeDialogContentComponent implements OnInit {
  action: string;
  local_data: any;
  selectedImage: any = '';
  joiningDate: any = '';
  carForm!: FormGroup;
  price: number;
  mileage: number;
  seats: number;
  imagePath: File;
  fileToUpload: any;
  imageUrl: any;

  constructor(
    private formBuilder: FormBuilder,
    private setting: CoreService,
    private toastr:ToastrService,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppEmployeeDialogContentComponent>,
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
    this.carForm = this.formBuilder.group({
      plate_number: ['', Validators.required],
      model: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', (Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/))],
      description: ['', Validators.required],
      mileage: ['', Validators.required],
      ac: ['', Validators.required],
      seats: ['', Validators.required],
      luggage: ['', Validators.required],
      fuel: ['', Validators.required],
    });
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: {...this.local_data, fileToUpload: this.fileToUpload} });
    // const formdata = new FormData()
    // formdata.append('Image', this.fileToUpload.name)
    // formdata.append('plate_number', this.local_data.plate_number)
    // formdata.append('model', this.local_data.model)
    // formdata.append('brand', this.local_data.brand)
    // formdata.append('price', this.local_data.price)
    // formdata.append('description', this.local_data.description)
    // formdata.append('mileage', this.local_data.mileage)
    // formdata.append('Air_Conditioning_Availability', this.local_data.ac)
    // formdata.append('seats', this.local_data.seats)
    // formdata.append('luggage', this.local_data.luggage)
    // formdata.append('fuel', this.local_data.fuel)

    if(this.action === "Add") {
      const payload = {
        "plate_number": this.carForm.value.plate_number,
        "Image": this.fileToUpload.name,
        "model": this.carForm.value.model,
        "brand": this.carForm.value.brand,
        "price": this.carForm.value.price,
        "description": this.carForm.value.description,
        "mileage": this.carForm.value.mileage,
        "Air_Conditioning_Availability": this.carForm.value.ac,
        "seats": this.carForm.value.seats,
        "luggage": this.carForm.value.luggage,
        "fuel": this.carForm.value.fuel,
      }

      this.setting.setCar(payload).subscribe((res: any) => {
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
    return this.carForm.controls[controlName].hasError(errorName);
  }
  // get priceControl(){
  //   return this.carForm.get('price');
  // }
}
