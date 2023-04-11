import { Component, OnInit, Type } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.css']
})
export class ExcelComponent implements OnInit {
  excel_table : any;
  show_Table: any[] = [];
  filterAboutTable: FormGroup;
  ngOnInit(): void {
    // this.tableOfExcel()
    // this.eliminarEmpleado()
     this.getDataTable()
  }

  constructor (
    private router: Router,
    private authFire: AngularFireAuth,
    private toastr: ToastrService,
    private firestore: AngularFirestore,
    private fb: FormBuilder,

  ){
    this.filterAboutTable = fb.group({
      color: ['', ],
      caballosNumber: ['', ],
      valor: ['', ],
      marca: ['', ],
    })
  }

  logOut(){
    this.authFire.signOut()
    this.toastr.success("Hasta Luego", "Sucess") 
    this.router.navigate(['/login'])
  }
  DataFile($event: any):void {
    const file  = $event.target.files[0]
    console.log(file.name)
    const fileReader = new FileReader()
    fileReader.readAsBinaryString(file)

    fileReader.onload = () => {
      let workBook = XLSX.read(fileReader.result, { type: 'binary'})
      let sheetName = workBook.SheetNames;
      this.excel_table = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName[0]])
      
      this.excel_table.forEach((data: any) => {
        let tableDatabase = {
          id: data.id,
          CV: data.CV,
          Color: data.Color,
          Modelo: data.Modelo,
          Nombre: data.Nombre,
        }
        this.saveDataUserinDataBase(tableDatabase).then((data: any) => {
        })
      })
      this.toastr.success(`Subiendo tabla ${file.name}`, "Sucess!")
    }

  }
  saveDataUserinDataBase(newUser: any): Promise <any>{
    return this.firestore.collection('excel').add(newUser);
  };
  getDataTable(){
    this.show_Table = []
     this.firestore.collection('excel', ref => ref.orderBy('id', 'asc')).snapshotChanges().subscribe(data => {
      data.forEach((a: any) => {
        this.show_Table.push({
          id: a.payload.doc.id,
          ...a.payload.doc.data(),
          uidTable: a.payload.doc.id
        })
      })
      console.log(this.show_Table)
     })
  }
  cleanDataTable(){
    this.show_Table = []
     this.firestore.collection('excel', ref => ref.orderBy('id', 'asc')).snapshotChanges().subscribe(data => {
      data.forEach((a: any) => {
        this.show_Table.push({
          id: a.payload.doc.id,
          ...a.payload.doc.data()
        })
      })
     })
    //  this.filterAboutTable.setValue({
    //   color: ['', ],
    //   caballosNumber: ['', ],
    //   valor: ['', ],
    //   marca: ['', ],
    //  })
     this.toastr.info("Tabla Reset", "Info")
  }
  getDataUserinDataBase(): Observable<any>{
    return this.firestore.collection('excel', ref => ref.where("Color", '==', "rojo")).snapshotChanges();
  }
  getDataWithColor(color: string): Observable<any>{
    return this.firestore.collection('excel', ref => ref.where("Color", '==', color).orderBy('id', 'asc')).snapshotChanges();
  }
  editEmpleado(id: string): Observable<any>{
    return this.firestore.collection('excel').doc(id).snapshotChanges();
  }
  changeinfo(id: string, data: any): Promise<any>{
    return this.firestore.collection('excel').doc(id).update(data);
  }
  async eliminarEmpleado(): Promise<any>{
    const batch = this.firestore.firestore.batch();
    const snapshot = await this.firestore.collection('excel').ref.get();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    this.toastr.success("Base Datos de Excel Borrada", "Sucess!")
    this.show_Table = []
    return await batch.commit();
    // return this.firestore.collection('excel').doc(id).delete();
  } 

  tableOfExcel():void {
    this.getDataUserinDataBase().subscribe((data) => {
      data.forEach((a: any) => {
        // console.log(a.payload.doc.data())
        // this.show_Table = [
        //   {id: a.payload.doc.data().id,},
        //   {CV: a.payload.doc.data().CV,},
        //   {Color: a.payload.doc.data().Color,},
        //   {Slug: a.payload.doc.data().Slug,},
        //   {Nombre: a.payload.doc.data().Nombre,}
        // ]
        // this.show_Table = {
        //   id: a.payload.doc.data().id,
        //   CV: a.payload.doc.data().CV,
        //   Color: a.payload.doc.data().Color,
        //   Slug: a.payload.doc.data().Slug,
        //   Nombre: a.payload.doc.data().Nombre,
        // }
        this.show_Table.push({
          id: a.payload.doc.id,
          ...a.payload.doc.data()
        })
      })
    })
    console.log(this.show_Table[0])
  }

  Caballos(){
    console.log(this.filterAboutTable)
  }
  select($event: any): void {
    console.log($event.target.value)
    console.log(this.filterAboutTable.value.valor)
  }
  datos(){
      
      this.show_Table = [''];
      let color = this.filterAboutTable.value.color
      let marca = this.filterAboutTable.value.marca
      let valor = this.filterAboutTable.value.valor
      let number = this.filterAboutTable.value.caballosNumber
      
      // this.searchFinal(color, marca, valor, number).subscribe((data) => {
      //   data.forEach((a: any) => {
      //     this.show_Table.push({ 
      //       id: a.payload.doc.id,
      //       ...a.payload.doc.data()
      //     })
      //   })
      // })



      if (this.filterAboutTable.value.color) {
        this.getDataWithColor(this.filterAboutTable.value.color).subscribe((data) => {
          data.forEach((a: any) => {
            this.show_Table.push({
              id: a.payload.doc.id,
              ...a.payload.doc.data()
            })
          })
        })
        this.toastr.info("Empezando a filtrar", "Info")
      }

      if (this.filterAboutTable.value.marca) {
        this.getDataWithMarca(this.filterAboutTable.value.marca).subscribe((data) => {
          data.forEach((a: any) => {
            this.show_Table.push({
              id: a.payload.doc.id,
              ...a.payload.doc.data()
            })
          })
        })
        this.toastr.info("Empezando a filtrar", "Info")
      }
    
      if (this.filterAboutTable.value.caballosNumber && this.filterAboutTable.value.valor) {
        // let number = this.filterAboutTable.value.caballosNumber+' CV'
        this.getDataWithCaballosNumber(this.filterAboutTable.value.valor ,number).subscribe((data) => {
          data.forEach((a: any) => {
            this.show_Table.push({
              id: a.payload.doc.id,
              ...a.payload.doc.data()
            })
          })
        })
        this.toastr.info("Empezando a filtrar", "Info")
      } else {
        this.show_Table = [""]
        this.getDataTable()
      }
    
  }
  searchFinal(color: any, marca: any, valor: any, number: any){
    console.log(color)
    let c: string = color
    console.log(valor, number)

    return this.firestore.collection('excel', ref => ref.where("CV", ">", 100)).snapshotChanges()
  }
  color(){
    console.log(this.filterAboutTable.value.color)
    this.getDataWithColor(this.filterAboutTable.value.color).subscribe((data) => {
      // console.log(data.)
      this.show_Table = []
      data.forEach((a: any) => {
        console.log(a.payload.doc.data())
        this.show_Table.push({
          id: a.payload.doc.id,
          ...a.payload.doc.data()
        })
      })
    })
  }
  getDataWithMarca(marca: any) {
    return this.firestore.collection('excel', ref => ref.where("Nombre", '==', marca)).snapshotChanges()
  }
  getDataWithCaballosNumber(valor: any, number: any){
      let n = parseInt(number)
      return this.firestore.collection('excel', ref => ref.where("CV", valor, n)).snapshotChanges()
  }
  informacion(id: any):void{
    console.log(id)
    
  }
}

