package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
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
	folderNameParam := r.Form["path"]
	if len(folderNameParam) == 0 {
		http.Error(w, "Please include 'path' parameter", http.StatusBadRequest)
		return
	}

	// handle
	files, err := getFolderContents(folderNameParam[0])
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
	filePathParam := r.Form["path"]
	if len(filePathParam) == 0 {
		http.Error(w, "Please include 'path' parameter", http.StatusBadRequest)
		return
	}

	// handle
	path := filepath.Join(ROOT_FOLDER, filePathParam[0])
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
// func dfsRootDirectory(folder FileModel) ([]FileModel, error) {
// 	contents, errr = getFolderContents(folder.Path)
// }

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

func toFileModel(relPath string, f os.FileInfo) FileModel {
	filePath := filepath.Join(relPath, f.Name())
	fileInfo := FileModel{f.Name(), f.Size(), f.IsDir(), filePath, []FileModel{}}
	return fileInfo
}
