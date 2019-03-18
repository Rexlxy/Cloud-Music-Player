package controllers

import (
	"github.com/astaxie/beego"
)

type ErrorController struct {
	beego.Controller
}

func (c *ErrorController) Error400() {
	c.Data["error"] = "bad request"
}

func (c *ErrorController) Error500() {
	c.Data["error"] = "server error"
}
