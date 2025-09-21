package services

import (
	"fmt"
	"io"
	"net/http"
	"openorganizer/src/db"
)

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func Root(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	fmt.Fprint(w, "connected")
}

func Create(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	r.ParseForm()
	k := r.FormValue("k")
	v := r.FormValue("v")

	if (k == "") || (v == "") {
		http.Error(w, "invalid input", http.StatusBadRequest)
		return
	}

	if (len(k) > 32) || (len(v) > 32) {
		http.Error(w, "string(s) too long", http.StatusBadRequest)
		return
	}

	err := db.Create(k, v)
	if err != nil {
		fmt.Printf("error inserting into table: %v\n", err)
		return
	}

	fmt.Fprintf(w, "stored '%s', '%s'", k, v)
}

func Read(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	r.ParseForm()
	k := r.FormValue("k")

	if k == "" {
		http.Error(w, "invalid input", http.StatusBadRequest)
		return
	}

	if len(k) > 32 {
		http.Error(w, "string too long", http.StatusBadRequest)
		return
	}

	values, err := db.Read(k)
	if err != nil {
		fmt.Printf("Error creating table: %v\n", err)
		return
	}

	if len(values) == 0 {
		fmt.Fprintf(w, "no values found under id = %s", k)
		return
	}

	for i := range values {
		fmt.Fprintf(w, "retrieved '%s' using '%s'\n", values[i], k)
	}
}

func Update(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	r.ParseForm()
	k := r.FormValue("k")
	v := r.FormValue("v")

	if (k == "") || (v == "") {
		http.Error(w, "invalid input", http.StatusBadRequest)
		return
	}

	if (len(k) > 32) || (len(v) > 32) {
		http.Error(w, "string(s) too long", http.StatusBadRequest)
		return
	}

	err := db.Update(k, v)
	if err != nil {
		fmt.Printf("error updating table: %v\n", err)
		return
	}

	fmt.Fprintf(w, "updated '%s' to '%s'", k, v)
}

func Delete(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	r.ParseForm()
	k := r.FormValue("k")

	if k == "" {
		http.Error(w, "invalid input", http.StatusBadRequest)
		return
	}

	if len(k) > 32 {
		http.Error(w, "string(s) too long", http.StatusBadRequest)
		return
	}

	err := db.Delete(k)
	if err != nil {
		fmt.Printf("error deleting from table: %v\n", err)
		return
	}

	fmt.Fprintf(w, "attempted to / deleted '%s'", k)
}

func Formdata(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	//r.ParseForm() for only urlencoded
	r.ParseMultipartForm(0x100)
	k := r.FormValue("k")

	if k == "" {
		http.Error(w, "k is empty", http.StatusBadRequest)
		return
	}

	fmt.Fprintf(w, "k = %s", k)
}

func Raw(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	r.Body = http.MaxBytesReader(w, r.Body, 0x100)

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Content-Length is too high, body is too small, or other read timeout", http.StatusBadRequest)
		return
	}

	fmt.Fprintf(w, "read:\n%s", body)
}
