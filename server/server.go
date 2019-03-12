package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

const (
	CONTENT_TYPE     string = "Content-Type"
	APPLICATOIN_JSON string = "application/json"
	ROOT_FOLDER             = "./music"
)

func main() {
	http.HandleFunc("/api/folder", getFolder)
	http.HandleFunc("/api/", serveMainPage)
	http.HandleFunc("/api/file", getFile)
	http.ListenAndServe(":8080", nil)
}

///////////////////////////////////////////  Handle  Functions ////////////////////////////////////////////

func serveMainPage(w http.ResponseWriter, r *http.Request) {
	// if r.URL.Path == "/" {
	http.ServeFile(w, r, "../webapp/dist/webapp/index.html") ///// + r.URL.Path)
	// } else {
	// 	http.ServeFile(w, r, "."+r.URL.Path)
	// }
}

func getFolder(w http.ResponseWriter, r *http.Request) {
	// parse parameter
	r.ParseForm()
	log.Println(r.Form)
	folderNameParam := r.Form["folderName"]
	if len(folderNameParam) == 0 {
		http.Error(w, "Please include 'folderName' parameter", http.StatusBadRequest)
		return
	}

	// handle
	path := ROOT_FOLDER + "/" + folderNameParam[0]
	files, err := getFolderContents(path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	// write data to response
	w.Header().Set(CONTENT_TYPE, APPLICATOIN_JSON)
	json.NewEncoder(w).Encode(files)
}

func getFile(w http.ResponseWriter, r *http.Request) {
	// parse parameter
	r.ParseForm()
	log.Println(r.Form)
	filePathParam := r.Form["filePath"]
	if len(filePathParam) == 0 {
		http.Error(w, "Please include 'filePath' parameter", http.StatusBadRequest)
		return
	}

	// handle
	path := ROOT_FOLDER + "/" + filePathParam[0]
	stat, err := os.Stat(path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	if stat.IsDir() {
		w.WriteHeader(500)
		return
	}
	http.ServeFile(w, r, path)
}

/////////////////////////////////////////// Common Part ////////////////////////////////////////////
type ApiError struct {
	status int
	error  string
}

func getFolderContents(path string) ([]FileModel, error) {
	files, err := ioutil.ReadDir(path)
	if err != nil {
		return nil, err
	}

	fileInfoList := []FileModel{}
	for _, f := range files {
		fileInfoList = append(fileInfoList, toFileModel(f))
	}
	return fileInfoList, nil
}

type FileModel struct {
	Name  string
	Size  int64
	IsDir bool
}

func toFileModel(f os.FileInfo) FileModel {
	fileInfo := FileModel{f.Name(), f.Size(), f.IsDir()}
	return fileInfo
}
