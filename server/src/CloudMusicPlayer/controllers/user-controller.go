package controllers

import (
	"log"
	"strings"
	"time"

	"github.com/astaxie/beego"
)

type UserController struct {
	beego.Controller
}

func (c *UserController) Get() {
	// login
	if strings.Contains(c.Ctx.Request.URL.Path, "login") {
		username := c.GetString("username")
		pw := c.GetString("pw")
		if username == "admin" && pw == "d2201baaa97ea0454e3924db65066861" {
			currentTime := time.Now()
			c.SetSession("login-time", currentTime.Format("2006-01-02 15:04:05"))
			c.SetSession("username", username)
			log.Println("Login Successfully")
			c.Data["json"] = Message{"Login Successfully", true}
			c.ServeJSON()
		} else {
			log.Println("Login Failed")
			c.Data["json"] = Message{"Wrong username or password", false}
			c.ServeJSON()
		}

		// logout
	} else if strings.Contains(c.Ctx.Request.URL.Path, "logout") {
		c.DestroySession()
		c.Data["json"] = Message{"Logged out", false}
		c.ServeJSON()
	} else {
		c.CustomAbort(404, "Not found")
	}
}

type Message struct {
	Message       string
	Authenticated bool
}
