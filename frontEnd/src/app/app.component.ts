import { Component, OnInit } from '@angular/core'
import { ProductosService } from './services/productos.service'
import { NgxSpinnerService } from "ngx-spinner"
import swal from 'sweetalert2'
import * as XLSX from 'xlsx'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  fileName: string = 'Informe.xlsx'
  filas: number = 0
  columnas: any[] = []
  info: any[] = []
  loading: boolean = false
  displayDialog: boolean = false
  titleModal: string = 'Agregar Producto'
  textBottom: string = 'Agregar'
  lbBtnModal: string = 'Cancelar'
  btnClean: string = 'Limpiar'
  op: string = 'Add'

  //Campos Productos
  idProd: number = 0
  nombreProd: string = ''
  cantProd: number = 1
  comentProd: string = ''

  constructor(
    private api: ProductosService,
    private spinner: NgxSpinnerService
  ){
    // Iniciamos las variables para la tabla
    this.filas = 10;
    this.columnas = [
      { field: 'nombre_prod', header: 'Nombre'},
      { field: 'cant_prod', header: 'Cantidad' },
      { field: 'coment_prod', header: 'Comentario' },
      { field: 'fecha_prod', header: 'Fecha' },
      { field: '', header: 'Acciones' }
    ]
  }

  async ngOnInit(): Promise<void> {
    this.spinner.show()
    await Promise.all([
      this.poblarTabla()
    ]);
    this.spinner.hide();
  }

  async poblarTabla() {
    await this.api.getProducts().then((data: any) => {
      this.info = data
    }, (error) => {
      swal.fire('Error!', `${ error.statusText }`, 'error')
    })
  }

  async agregarProd() {
    if (this.nombreProd == '' || this.cantProd == 0 || this.comentProd == '') {
      swal.fire({
        position: 'bottom-end',
        icon: 'warning',
        title: 'Debe llenar los campos obligatorios(Nombre, Cantidad y Comentario)!',
        showConfirmButton: false,
        timer: 2000,
        toast: true
      })
    } else {
      if (this.info.findIndex(x => x.nombre_prod === this.nombreProd) != -1) {
        swal.fire({
          position: 'bottom-end',
          icon: 'warning',
          title: 'Ya tiene registrado este producto!',
          showConfirmButton: false,
          timer: 2000,
          toast: true
        });
      } else {
        let object = {
          nombre_prod: this.nombreProd,
          cant_prod: this.cantProd,
          coment_prod: this.comentProd
        }
        this.loading = true
        this.spinner.show()
        await this.api.insertProd(object).then((data) => {
          this.spinner.hide()
          let res: any = data
          if (res['status']) {
            swal.fire({
              position: 'top-end',
              icon: 'success',
              title: res['mgs'],
              showConfirmButton: false,
              timer: 2000
            }).then(async () => {
              await this.poblarTabla()
              this.loading = false
              this.displayDialog = false
              this.clean()
            });
          } else {
            swal.fire('Cuidado!', res['mgs'], 'warning')
            this.spinner.hide()
          }
        }, (error) => {
          swal.fire('Error!', `${ error.statusText }`, 'error')
        });
      }
    }
  }

  async editarProd() {
    if (this.idProd == 0 || this.nombreProd == '' || this.cantProd == 0 || this.comentProd == '') {
      swal.fire({
        position: 'bottom-end',
        icon: 'warning',
        title: 'Debe llenar los campos obligatorios(Nombre, Cantidad y Conentario)!',
        showConfirmButton: false,
        timer: 2000,
        toast: true
      })
    } else {
      let validateName = this.info.findIndex(x => x.nombre_prod === this.nombreProd)
      if ((validateName != -1) && (this.info[validateName].id != this.idProd)) {
        swal.fire({
          position: 'bottom-end',
          icon: 'warning',
          title: 'Ya tiene registrado este producto!',
          showConfirmButton: false,
          timer: 2000,
          toast: true
        });
      } else {
        let object = {
          nombre_prod: this.nombreProd,
          cant_prod: this.cantProd,
          coment_prod: this.comentProd
        }
        this.loading = true
        this.spinner.show()
        await this.api.updateProd(this.idProd, object).then((data) => {
          let res: any = data
          this.spinner.hide()
          if (res['status']) {
            swal.fire({
              position: 'top-end',
              icon: 'success',
              title: res['mgs'],
              showConfirmButton: false,
              timer: 2000
            }).then(async () => {
              await this.poblarTabla()
              this.loading = false
              this.displayDialog = false
              this.clean()
            });
          } else {
            swal.fire('Cuidado!', res['mgs'], 'warning')
            this.spinner.hide()
          }
        }, (error) => {
          swal.fire('Error!', `${ error.statusText }`, 'error')
        })
      }
    }
  }

  async deleteProd(id: any) {
    swal.fire({
      title: 'Esta seguro de realizar esta accion?',
      text: 'Se va a eliminar el Producto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#B9B6B5',
    }).then(async (result) => {
      if (result.value) {
        this.loading = true
        this.spinner.show()
        await this.api.deleteProd(id).then((data: any) => {
          if (data['status']) {
            swal.fire({
              position: 'top-end',
              icon: 'success',
              title: data['mgs'],
              showConfirmButton: false,
              timer: 2000
            }).then(async () => {
              await this.poblarTabla()
              this.loading = false
              this.spinner.hide()
            });
          } else {
            swal.fire('Cuidado!', data['mgs'], 'warning')
            this.poblarTabla()
            this.loading = false
            this.spinner.hide()
          }
        }, (error) => {
          swal.fire('Error!', `${ error.statusText }`, 'error')
        });
      }
    });
  }

  clean() {
    this.nombreProd = ''
    this.cantProd = 1
    this.comentProd = ''
  }

  open() {
    this.clean()
    this.titleModal = 'Agregar Producto'
    this.textBottom = 'Agregar'
    this.op = 'Add'
    this.displayDialog = true
  }

  openUpdate(producto: { id: number; nombre_prod: string; cant_prod: number; coment_prod: any; }) {
    this.titleModal = 'Editar Producto'
    this.textBottom = 'Editar'
    this.op = 'Edit'
    this.idProd = producto.id
    this.nombreProd = producto.nombre_prod
    this.cantProd = producto.cant_prod
    this.comentProd = producto.coment_prod
    this.displayDialog = true
  }

  descargarExcel() {
    let inform: any[] = new Array()
    let formato: any = ''
    this.info.forEach(element => {
      formato = this.formatearFecha(new Date(element.fecha_prod))
      let params = {
        nombre_prod: element.nombre_prod,
        cant_prod: element.cant_prod,
        coment_prod: element.coment_prod,
        fecha_prod: formato.fecha
      };
      inform.push(params)
    });
    // Obtenemos el json
    const ws = XLSX.utils.json_to_sheet(inform)
    // Asignamos nombre a las columnas
    ws['A1'].v = "Nombre"
    ws['B1'].v = "Cantidad"
    ws['C1'].v = "Comentario"
    ws['D1'].v = "Fecha"

    // Generamos el libro y agregamos loas hojas
    const wb: XLSX.WorkBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Informe Productos')

    // Guardamos en el archivo
    XLSX.writeFile(wb, this.fileName)
  }

  // Formato deseado de la fecha
  formatearFecha(date: Date) {
    let h = this.addZero(date.getHours())
    let m = this.addZero(date.getMinutes())
    let s = this.addZero(date.getSeconds())
    let anio = date.getFullYear()
    let mes = this.addZero(date.getMonth() + 1)
    let dia = this.addZero(date.getDate())
    let formato = {
      completo: anio + "-" + mes + "-" + dia + " " + h + ":" + m + ":" + s,
      fecha: anio + "-" + mes + "-" + dia,
      hora: h + ":" + m + ":" + s
    }
    return formato;
  }

  addZero(i: string | number) {
    if (i < 10) {
      i = "0" + i
    }
    return i
  }
}
