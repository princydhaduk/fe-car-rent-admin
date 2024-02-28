import { AppSettings } from './../../../app.config';
import { Component, Inject, Optional, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AppAddEmployeeComponent } from './add/add.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreService } from 'src/app/services/core.service';

// export interface Cars {
//   id:number,
//   model:string,
//   price:string,
//   description: string,
//   mileage:string,
//   ac:string,
//   seats:string,
//   luggage:string,
//   fuel:string,
//   brand: string,
//   imagePath: string,
// }


@Component({
  templateUrl: './employee.component.html',
})
export class AppEmployeeComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;
  carForm!:FormGroup;
  dataSource = [];
  displayedColumns: any = [
    '#',
    'plate_number',
    'Image',
    'model',
    'brand',
    'price',
    'description',
    'mileage',
    'ac',
    'seats',
    'luggage',
    'fuel',
  ];

  // dataSource = new MatTableDataSource(Cars);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(public dialog: MatDialog, public datePipe: DatePipe, private formBuilder:FormBuilder) { }

  ngAfterViewInit(): void {
    // this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
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
        // this.updateRowData(result.data);
      } else if (result.event === 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  // tslint:disable-next-line - Disables all
  addRowData(row_obj: any): void {
    // // this.dataSource.data.unshift({
    // //   id: Cars.length + 1,
    // //   model: row_obj.model,
    // //   price: row_obj.price,
    // //   description: row_obj.description,
    // //   mileage: row_obj.mileage,
    // //   ac: row_obj.ac,
    // //   seats: row_obj.seats,
    // //   luggage: row_obj.luggage,
    // //   fuel: row_obj.fuel,
    // //   brand: row_obj.brand,
    // //   imagePath: row_obj.imagePath,
    // });
    this.dialog.open(AppAddEmployeeComponent);
    // this.table.renderRows();

  }

  // tslint:disable-next-line - Disables all
  // updateRowData(row_obj: Employee): boolean | any {
  //   this.dataSource.data = this.dataSource.data.filter((value: any) => {
  //     if (value.id === row_obj.id) {
  //       value.Name = row_obj.Name;
  //       value.Position = row_obj.Position;
  //       value.Email = row_obj.Email;
  //       value.Mobile = row_obj.Mobile;
  //       value.DateOfJoining = row_obj.DateOfJoining;
  //       value.Salary = row_obj.Salary;
  //       value.Projects = row_obj.Projects;
  //       value.imagePath = row_obj.imagePath;
  //     }
  //     return true;
  //   });
  // }

  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj: any): boolean | any {
    // this.dataSource.data = this.dataSource.data.filter((value: any) => {
    //   return value.id !== row_obj.id;
    // });
  }
}




@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  templateUrl: 'employee-dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class AppEmployeeDialogContentComponent implements OnInit{
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  selectedImage: any = '';
  joiningDate: any = '';
  userForm!: FormGroup;
  Image:File;
  // plate_number: string;
  // model:string;
  // brand:string;
  // price:string;
  // description:string;
  // mileage:string;
  // ac:string;
  // seats:string;
  // luggage:string;
  // fuel:string;

  constructor(
    private formBuilder:FormBuilder,
    private setting:CoreService,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppEmployeeDialogContentComponent>,
    // @Optional() is used to prevent error if no data is passed
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
    if (this.local_data.Image === undefined) {
      this.local_data.image = 'assets/images/profile/user-1.jpg';
    }
  }

  ngOnInit(): void {
    this.getCarDisplay();
    this.userForm = this.formBuilder.group({
      Image:['',Validators.required],
      plate_number: ['',Validators.required],
      model: ['',Validators.required],
      brand: ['',Validators.required],
      price: ['',Validators.required],
      description: ['',Validators.required],
      mileage:['',Validators.required],
      ac:['',Validators.required],
      seats:['',Validators.required],
      luggage: ['',Validators.required],
      fuel: ['',Validators.required],
    });
}

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
debugger
    const formdata = new FormData()
    formdata.append('Image',this.local_data.Image, this.local_data.Image.name)
    formdata.append('plate_number',this.local_data.plate_number)
    formdata.append('model',this.local_data.model)
    formdata.append('brand',this.local_data.brand)
    formdata.append('price',this.local_data.price)
    formdata.append('description',this.local_data.description)
    formdata.append('mileage',this.local_data.mileage)
    formdata.append('ac',this.local_data.ac)
    formdata.append('seats',this.local_data.seats)
    formdata.append('luggage',this.local_data.luggage)
    formdata.append('fuel',this.local_data.fuel)

  //  debugger
    this.setting.setCar(formdata).subscribe((res:any) => {
      if(res){
        console.log("res====", res);
      }
    });
    console.log("formdata",formdata);
  }

  getCarDisplay(){
     this.setting.getCar().subscribe((res:any) => {
       if(res){
        const datasource= res.message.data;
       }
     });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  selectFile(event: any): void {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      // this.msg = 'You must select an image';
      return;
    }
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.msg = "Only images are supported";
      return;
    }
    // tslint:disable-next-line - Disables all
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    // tslint:disable-next-line - Disables all
    reader.onload = (_event) => {
      // tslint:disable-next-line - Disables all
      this.local_data.Image = reader.result;
    };
  }
}
