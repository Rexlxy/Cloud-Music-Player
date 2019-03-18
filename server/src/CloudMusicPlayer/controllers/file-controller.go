package controllers

import (
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/astaxie/beego"
)

type FileController struct {
	beego.Controller
}

// Get folder contents in JSON or serve file
func (c *FileController) Get() {
	relPath, err := filepath.Rel("/api/music-data", c.Ctx.Request.URL.Path)
	if err != nil {
		c.CustomAbort(500, err.Error())
	}
	log.Println("filePath parameter: ", relPath)

	absPath := filepath.Join(ROOT_FOLDER, relPath)
	stat, err := os.Stat(absPath)

	if err != nil {
		c.CustomAbort(500, err.Error())
	}

	// return directory contents
	if stat.IsDir() {
		log.Println("GET folder:", relPath)
		files, err := getFolderContents(relPath)
		if err != nil {
			c.CustomAbort(500, err.Error())
		}
		// Filter: only folders or music files
		filtered := Filter(files,
			func(f FileModel) bool {
				if f.IsDir {
					return true
				}
				return strings.Contains(f.Name, ".mp3")
			})
		c.Data["json"] = filtered
		c.ServeJSON()

		// server file
	} else {
		log.Println("GET file:", relPath)
		http.ServeFile(c.Ctx.ResponseWriter.ResponseWriter, c.Ctx.Request, absPath)
	}
}

// Update file name or directory name
func (c *FileController) Put() {
	checkAuth(c)
	newName := c.GetString("value")
	if newName == "" {
		c.CustomAbort(400, "Missing parameter: value")
	}
	filePath, err := filepath.Rel("/api/music-data", c.Ctx.Request.URL.Path)
	if err != nil {
		c.CustomAbort(500, err.Error())
	}

	oldAbsPath := filepath.Join(ROOT_FOLDER, filePath)
	oldDirPath := filepath.Dir(filepath.Join(ROOT_FOLDER, filePath))
	newPath := filepath.Join(oldDirPath, newName)

	log.Println("Rename - old path:", oldAbsPath)
	log.Println("Rename - new path:", newPath)
	err = os.Rename("./"+oldAbsPath, "./"+newPath)
	if err != nil {
		c.CustomAbort(500, err.Error())
	}
}

// Upload file or make a new directory
func (c *FileController) Post() {
	checkAuth(c)
	isDir, err := c.GetBool("isDir")
	if err != nil {
		c.CustomAbort(400, err.Error())
	}

	relPath, err := filepath.Rel("/api/music-data", c.Ctx.Request.URL.Path)
	if err != nil {
		c.CustomAbort(500, err.Error())
	}
	absPath := filepath.Join(ROOT_FOLDER, relPath)

	// Make new directory
	if isDir {
		err = os.Mkdir(absPath, os.ModePerm)
		// Upload file
	} else {
		err = c.SaveToFile("file", absPath)
	}
	checkInternalError(err, c)

	// Return JSON of file/directory info
	f, err := os.Stat(absPath)
	checkInternalError(err, c)
	c.Data["json"] = toFileModel(filepath.Dir(relPath), f)
	c.ServeJSON()
}

func (c *FileController) Delete() {
	checkAuth(c)
	filePath, err := filepath.Rel("/api/music-data", c.Ctx.Request.URL.Path)
	if err != nil {
		c.CustomAbort(500, err.Error())
	}
	if filePath == "" {
		c.CustomAbort(400, "Not allowed to delete root folder: /")
	}
	if err := os.RemoveAll(filepath.Join(ROOT_FOLDER, filePath)); err != nil {
		c.CustomAbort(500, err.Error())
	}
}

func checkAuth(c *FileController) {
	log.Println("session, login-time=", c.GetSession("login-time"))
	if lt := c.GetSession("login-time"); lt == nil || lt == "" {
		c.CustomAbort(401, "Please login first")
	}
}

func checkInternalError(err error, c *FileController) {
	if err != nil {
		log.Println(err)
		c.CustomAbort(500, err.Error())
	}
}

var ROOT_FOLDER string = "./music"

func getFolderContents(relPath string) ([]FileModel, error) {
	files, err := ioutil.ReadDir(filepath.Join(ROOT_FOLDER, relPath))
	if err != nil {
		return nil, err
	}

	fileInfoList := []FileModel{}
	for _, f := range files {
		fileInfoList = append(fileInfoList, toFileModel(relPath, f))
	}
	return fileInfoList, nil
}

type FileModel struct {
	Name     string
	Size     int64
	IsDir    bool
	Path     string
	FileList []FileModel
}

func toFileModel(parentFolderRelPath string, f os.FileInfo) FileModel {
	filePath := filepath.Join("/", parentFolderRelPath, f.Name())
	fileInfo := FileModel{f.Name(), f.Size(), f.IsDir(), filePath, []FileModel{}}
	return fileInfo
}

func Filter(vs []FileModel, f func(FileModel) bool) []FileModel {
	vsf := make([]FileModel, 0)
	for _, v := range vs {
		if f(v) {
			vsf = append(vsf, v)
		}
	}
	return vsf
}
