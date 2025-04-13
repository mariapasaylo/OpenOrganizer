package main

import (
	"fmt"
	"net/http"
	"strconv"
)

func main() {

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Connected")
	})

	http.HandleFunc("/add", func(w http.ResponseWriter, r *http.Request) {
		r.ParseForm()
		a := r.FormValue("a")
		b := r.FormValue("b")

		aInt, err0 := strconv.Atoi(a)
		bInt, err1 := strconv.Atoi(b)

		if (err0 != nil) || (err1 != nil) {
			http.Error(w, "Invalid Input", http.StatusBadRequest)
			return
		}

		fmt.Fprintf(w, "%d + %d = %d", aInt, bInt, aInt+bInt)
	})

	const PORT string = ":3001"
	fmt.Println("Hello, World! Running on port " + PORT)
	if error := http.ListenAndServe(PORT, nil); error != nil {
		fmt.Println("Server is not running")
	}
}
