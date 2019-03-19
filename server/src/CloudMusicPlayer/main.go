package main

import (
	"CloudMusicPlayer/controllers"
	_ "CloudMusicPlayer/routers"
	"log"

	"github.com/astaxie/beego"
)

func main() {
	beego.ErrorController(&controllers.ErrorController{})
	log.Printf("Music folder: %s\n", beego.AppConfig.String("musicFolder"))
	beego.Run()
}
