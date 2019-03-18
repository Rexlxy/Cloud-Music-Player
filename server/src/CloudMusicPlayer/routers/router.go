package routers

import (
	"CloudMusicPlayer/controllers"

	"github.com/astaxie/beego"
)

func init() {
	beego.Router("/api/user/*", &controllers.UserController{})
	beego.Router("/api/music-data/*", &controllers.FileController{})
}
