//App.jsの初期コードを全消しして、rncでスペニットからコードを生成する

import React, { Component } from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, Alert, Text} from 'react-native';
import Matter from 'matter-js';
import { GameEngine } from 'react-native-game-engine';
import Bird from './Bird';
import Constants from './Constants';
import Physics from './Physics';
import Wall from './Wall';

export const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const generatePipes = () => {
  let topPipeHeight = randomBetween(100, (Constants.MAX_HEIGHT / 2) - 100);
  let bottomPipeHeight = Constants.MAX_HEIGHT - topPipeHeight - Constants.GAP_SIZE;
  let sizes = [topPipeHeight, bottomPipeHeight];

  if (Math.random() < 0.5) {
    sizes = sizes.reverse();
  }

  return sizes;
}

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      running: true
    };

    this.gameEngine = null;
    this.entities = this.setupWorld();
  }

  //毎tick描画
  setupWorld = () => {
    let engine = Matter.Engine.create({
      enableSleeping: false
    });
    let world = engine.world;

    //50x50の鳥の体を作成
    let bird = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 4,   //画面横位置から
      Constants.MAX_HEIGHT / 2,  //画面縦位置から
      50,                        //横サイズ
      50                         //縦サイズ
    );

    //床
    let floor = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      Constants.MAX_HEIGHT - 25,
      Constants.MAX_WIDTH,
      50,
      { isStatic: true }
    );

    //天井
    let ceiling = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      25,
      Constants.MAX_WIDTH,
      50,
      { isStatic: true }
    );

    //障害物1&2
    let [pipe1Height, pipe2Height] = generatePipes();
    let pipe1 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH - (Constants.PIPE_WIDTH / 2),
      pipe1Height / 2,
      Constants.PIPE_WIDTH,
      pipe1Height,
      { isStatic: true }
    )
    let pipe2 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH - (Constants.PIPE_WIDTH / 2),
      Constants.MAX_HEIGHT - (pipe2Height / 2),
      Constants.PIPE_WIDTH,
      pipe2Height,
      { isStatic: true }
    )

    //障害物3&4
    let [pipe3Height, pipe4Height] = generatePipes();
    let pipe3 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH * 2 - (Constants.PIPE_WIDTH / 2),
      pipe3Height / 2,
      Constants.PIPE_WIDTH,
      pipe3Height,
      { isStatic: true }
    )
    let pipe4 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH * 2 - (Constants.PIPE_WIDTH / 2),
      Constants.MAX_HEIGHT - (pipe4Height / 2),
      Constants.PIPE_WIDTH,
      pipe4Height,
      { isStatic: true }
    )

    //Matter.World.add(ゲームシーン, [ゲーム内オブジェクト配列])
    Matter.World.add(world, [bird, floor, ceiling, pipe1, pipe2, pipe3, pipe4]);      

    //衝突判定
    Matter.Events.on(engine, 'collisionStart', (event) => {
      var pairs = event.pairs;
      console.log("Pair no visible: ", pairs)
      console.log("Pair visible: ", pairs[0]);
      console.log("colision between " + pairs[0].bodyA.label + " - " + pairs[0].bodyB.label);


      this.gameEngine.dispatch({ type: "game-over"}); //onEventにgame-overを発疹
    })

    //GameEngineに返す描画プロパティ配列?
    return {
      physics: { engine: engine, world: world },
      bird: { body: bird, size: [50, 50], color: 'red', renderer: Bird },
      floor: { body: floor, size: [Constants.MAX_WIDTH, 50], color: "green", renderer: Wall},
      ceiling: { body: ceiling, size: [Constants.MAX_WIDTH, 50], color: "green", renderer: Wall },
      pipe1: { body: pipe1, size: [Constants.PIPE_WIDTH, pipe1Height], color: "green", renderer: Wall },
      pipe2: { body: pipe2, size: [Constants.PIPE_WIDTH, pipe2Height], color: "green", renderer: Wall },
      pipe3: { body: pipe3, size: [Constants.PIPE_WIDTH, pipe3Height], color: "green", renderer: Wall },
      pipe4: { body: pipe4, size: [Constants.PIPE_WIDTH, pipe4Height], color: "green", renderer: Wall },
    }
  }

  onEvent = (e) => {
    if (e.type === "game-over") {
      this.setState({
        running: false
      });
    }
  }
  
  reset = () => {
    this.gameEngine.swap(this.setupWorld());
    this.setState({
      running: true
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <GameEngine
          ref={(ref) => { this.gameEngine = ref; }}
          style={styles.gameContainer}
          running={this.state.running}
          systems={[Physics]}
          onEvent={this.onEvent}
          entities={this.entities}>
          <StatusBar hidden={true} />
        </GameEngine>
        {!this.state.running &&
          <TouchableOpacity
            style={styles.fullScreenButton}
            onPress={this.reset}>
            <View style={styles.fullScreen}>
              <Text style={styles.gameOverText}>GameOver</Text>
            </View>
          </TouchableOpacity>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gameContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  gameOverText: {
    color: 'white',
    fontSize: 48
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fullScreenButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1
  }
})
