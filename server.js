var express = require('express');
const { json } = require('express/lib/response');
const WebSocketServer = require('ws')

var app = express()

var PORT = 3000

let games = [];

function uuid() {
  return 'xxxx-xxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

app.get('/create_game', (req, res) => {
  if (/* req.query.name === undefined || req.query.name === '' ||  */req.query.game_type === undefined || req.query.game_type === '') {
    res.status(400).end('bad request');
    return
  }
  games.push({
    game_id: uuid(),
    game_type: req.query.game_type.toLocaleLowerCase(),
    players: [],
  })
console.log('game created');
  // send games to clients
  for (let i = 0; i < listeningPlayers.length; i++) {
    const ws = listeningPlayers[i];
    ws.send(JSON.stringify(games))
  }

  res.end(games[games.length - 1].game_id)
})
/* app.get('/join_game', (req, res) => {
  if (req.query.game_id === undefined || req.query.game_id == '' || req.query.name === undefined || req.query.name == '') {
    res.status(400).end('bad request');
    return
  }
  for (let i = 0; i < games.length; i++) {
    let game = games[i];
    if (game.game_id === req.query.game_id) {
      for (let j = 0; j < game.players.length; j++) {
        let player = game.players[j];
        if (player.name === req.query.name) {
          res.end('name already exist')
          return
        }
      }
      game.players.push({
        name: req.query.name,
        score: 0,
        ws: '',
      })
    }
  }
  res.end('joined')
}) */

app.get('/delete_game', (req, res) => {
  if (req.query.game_id === undefined || req.query.game_id == '') {
    res.status(400).end('bad request')
    return
  }

  let newGames = []
  for (let i = 0; i < games.length; i++) {
    let game = games[i]
    if (game.game_id !== req.query.game_id) {
      newGames.push(game)
    }
  }
game = newGames;
  // send games to clients
  for (let i = 0; i < listeningPlayers.length; i++) {
    const ws = listeningPlayers[i];
    ws.send(JSON.stringify(games))
  }

  res.end('done')
})

app.listen(PORT, () => {
  console.log('Server is running on PORT:', PORT)
})


const wss = new WebSocketServer.Server({ port: 8080 })

let listeningPlayers = []

wss.on("connection", ws => {
console.log('new client');

  ws.on("message", data => {
    const jsonData = JSON.parse(data)

    if (jsonData.action === 'listen_for_games') {
console.log('new client');
listeningPlayers.push(ws)
      ws.send(JSON.stringify(games))
      return
    }

    if (jsonData.action === 'join_game') {
      if (jsonData.game_id === undefined || jsonData.game_id == '' || jsonData.name === undefined || jsonData.name == '') {
        ws.send('bad join request.\nrequired game_id and name')
        return
      }


      for (let i = 0; i < games.length; i++) {
        let game = games[i];
        if (game.game_id === jsonData.game_id) {
          for (let j = 0; j < game.players.length; j++) {
            let player = game.players[j];
            if (player.name === req.query.name) {
              ws.send('name already exist')
              return
            }
          }
          game.players.push({
            name: jsonData.name,
            score: 0,
            ws: ws,
          })
          for (let i = 0; i < listeningPlayers.length; i++) {
            const ws = listeningPlayers[i];
            ws.send(JSON.stringify(games))
          }
          return
        }
      }
      return
    }
    console.log(`Client has sent us: ${data}`)
  });

  ws.on('close', data => {
    let newlisteningPlayers = []
    for (let i = 0; i < listeningPlayers.length; i++) {
      const lPlayer = listeningPlayers[i];
      if (lPlayer !== ws) {
        newlisteningPlayers.push(lPlayer)
      } // TODO FIX ME websockets werden nicht richtig entfernt, genau so, wie spiele !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
    }
    listeningPlayers = newlisteningPlayers
  })

  ws.onerror = function () {
    console.log("Some Error occurred")
  }
});
console.log("WebSocket server is running on PORT: 8080");