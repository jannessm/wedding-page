gnome-terminal --tab --title=PHP -- bash -c \\
    "gnome-terminal --tab --title=NODE -- bash -c \"cd webpage; npm install; npm start\"; cd server; php -S localhost:8080 -t ."