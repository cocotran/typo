package main

import(
	"fmt"
	"os"
	"encoding/json"
	"log"
	"net/http"
	"github.com/gorilla/mux"
	"cloud.google.com/go/firestore"
	"google.golang.org/api/option"
	"context"
	"github.com/spf13/viper"
)

// slice Text struct to be returned when receive API request from front end
var texts []Text

// Text struct
type Text struct {
	Source	string	`json: "category"`
	Content	string	`json: "content"`
}


func getText(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	// allow CORS
	w.Header().Set("Access-Control-Allow-Origin", "*")
	// return texts in json format
	json.NewEncoder(w).Encode(texts)
}


var NewUrl string = "/pages/index.html"
// redirect to "/pages/index.html" page when "/" page is requested
func serveHTTP(w http.ResponseWriter, r *http.Request) {
    uri := r.URL.Path
    if uri == "/" {
        http.Redirect(w, r, NewUrl, http.StatusSeeOther)
    }
    fmt.Fprintf(w, uri)
    return
}

const (
	// project ID for firestore
	projectID = "typo"
)

func main()  {
	// firestore initialize
	jsonPath := "./key.json"
	ctx := context.Background()
	client, err := firestore.NewClient(ctx, projectID, option.WithCredentialsFile(jsonPath))
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}
	defer client.Close()

	// fetching data from firestore
	// biology := client.Doc("facts/biology")
	facts := client.Collection("facts")
	biology := facts.Doc("biology")
	docsnap, err := biology.Get(ctx)
	if err != nil {
		log.Fatalf("Failed: %v", err)
	}
	dataMap := docsnap.Data()
	for key, value := range dataMap {
		// fmt.Println("Key:", key, "Value:", value)
		contentString := value.(string)
		texts = append(texts, Text{Source: key, Content: contentString})
	}
	// fmt.Println(texts)

	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("$PORT must be set")
	}

	// Initialize router
	router := mux.NewRouter()
	staticFileDirectory := http.Dir("./pages/")
	staticFileHandler := http.StripPrefix("/pages/", http.FileServer(staticFileDirectory))

	// Route handlers
	router.PathPrefix("/pages/").Handler(staticFileHandler).Methods("GET")

	router.HandleFunc("/", serveHTTP).Methods("GET")
	router.HandleFunc("/api/text", getText).Methods("GET")

	log.Fatal(http.ListenAndServe(":" + port, router))
}