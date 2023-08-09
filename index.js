const express = require('express');
const app = express();
const path = require('path');
//for direct view static filte kind html to public folder
app.use(express.static('public'));

// Set the views directory and view engine for EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



//for parsing req boy to key and value object
app.use(express.urlencoded({extended:true}));

let playList = []; 

//rresponsible to index view and passing playlist
app.get('/', (req,res) => {
    if(playList.length > 0){
        //ordered songs according their playtime
        const orderedPlaylist = playList.sort((a,b) => {
            return b.played - a.played;
        });
            

        res.render('index.ejs',{playList: orderedPlaylist});

    }else{
        res.render('index.ejs',{playList: []});
    }
});

//responsible for routing to form page
app.get('/inputSongs',(req,res)=>{
    res.render('inputSong.ejs');
});

// responsible to input song form req body /inputSongs
app.post('/song',(req,res)=> {
    let id = playList.length > 0 ? playList.length : 0 ;

    let title = req.body.title.trim();
    let artis = req.body.artis;
    //split artist by ',' when artists more than 1 and erase space with trim()
    let arrayArtis = artis.trim().split(',').map((artis) => artis.trim());
    let url = req.body.url.trim();
    
    //append object song that contain req body value to array playList
    const song = {id:id,title: title, artis: arrayArtis, url: url, played: 0};
    playList.push(song);
    res.redirect('/');
    

});

//responsible to routing to /song/:id that contain detail song
app.get('/songs/:id',(req,res)=>{
    let id = req.params.id;
    
    const chosenSong = playList.filter((lagu) => lagu.id == id);

    
    res.render('detailsong.ejs', {song: chosenSong});
    
});

//Played + 1 for the chosen song
app.get('/play/:id',(req,res)=>{
    let id = req.params.id;
    let chosenSong = playList.filter((song) => song.id == id );
    let urlSong = chosenSong[0].url;
    playList.filter((song) => song.id == id ).map((song) => song.played++);
    res.redirect('/');
});

//responsible for delete chosen song and redirect to index and make id reorder from 0
app.get('/delete/:id', (req,res) => {
    let id = req.params.id;
    
    playList.forEach((song,index) => {
        if(song.id == id){
            playList.splice(index,1);
        }
    } );

    playList.map((song,index) => song.id = index );
    
    res.redirect('/');
    
});


//run apps on port 3000
app.listen(3000, ()=>{
    console.log('Server Berjalan di port 3000');
})