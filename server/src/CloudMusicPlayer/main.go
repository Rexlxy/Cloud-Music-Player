package main

import (
	"CloudMusicPlayer/controllers"
	_ "CloudMusicPlayer/routers"

	"github.com/astaxie/beego"
)

func main() {
	beego.ErrorController(&controllers.ErrorController{})
	beego.Run()
}
