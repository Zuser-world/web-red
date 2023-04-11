import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.css']
})
export class YoutubeComponent implements OnInit {
  videosOfYoutube: any[] = []; //
  search: FormGroup;
  urlString : string = '';
  ngOnInit(): void {
  }

  constructor (
    private router: Router,
    private authFire: AngularFireAuth,
    private toastr: ToastrService,
    private fb: FormBuilder,

  ){
    this.search = fb.group({
      text : ['']
    })
  }
  logOut(){
    this.authFire.signOut()
    this.toastr.success("Hasta Luego", "Sucess") 
    this.router.navigate(['/login'])
  }
  busqueda(search: any){

    let apikey = apis[Math.floor(apis.length * Math.random())]
    const options = {
      method: 'GET',
    };
    
    fetch(`https://api.zahwazein.xyz/downloader/ytplay?apikey=${apikey}&query=${search}`, options)
      .then(response => response.json())
      .then((response : any ) => {
        this.videosOfYoutube.push(response)
        console.log(response)
      })
      .catch(err => console.error(err));
  }
  actionStart(){
    console.log(this.search.value.text)
    let search = this.search.value.text
    this.busqueda(search)
    console.log("Despues")
    console.log(this.videosOfYoutube)
  }

  downloadAPI(enlace: any){
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        
        'X-RapidAPI-Host': 'youtube-to-mp315.p.rapidapi.com'
      },
      body: '{}'
    };
    
    fetch(`https://youtube-to-mp315.p.rapidapi.com/download?url=${enlace}`, options)
      .then(response => response.json())
      .then(response => {
        console.log(response.link)
        this.urlString = response.link
      })
      .catch(err => console.error(err));
  }

  downloadFile(url: any) {
    window.location.href = url
  }
  downloadMusic(musicUrl: any, nameMusica: any) {
    console.log(musicUrl)
    let UrlEncoder = encodeURIComponent(musicUrl)
    // Url Encoder 
    console.log(UrlEncoder)
    this.downloadAPI(UrlEncoder)
    //this.downloadFile(this.urlString)
    console.log(this.urlString)
    
  }
}
