//App.jsの初期コードを全消しして、rncでスペニットからコードを生成する

import React, { Component } from 'react';
import { View, StyleSheet, StatusBar} from 'react-native';
import Matter from 'matter-js';
import { GameEngine } from 'react-native-game-engine';
import Bird from './Bird';
import Constants from './Constants';
import Physics from './Physics';
import Wall from './Wall';

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


    Matter.World.add(world, [bird, floor, ceiling]);      //Matter.World.add(ゲームシーン, [ゲーム内オブジェクト配列])

    //GameEngineに返す描画プロパティ配列?
    return {
      physics: { engine: engine, world: world },
      bird: { body: bird, size: [50, 50], color: 'red', renderer: Bird },
      floor: { body: floor, size: [Constants.MAX_WIDTH, 50], color: "green", renderer: Wall},
      ceiling: { body: ceiling, size: [Constants.MAX_WIDTH, 50], color: "green", renderer: Wall },
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <GameEngine
          ref={(ref) => { this.gameEngine = ref; }}
          style={styles.gameContainer}
          running={this.state.running}
          systems={[Physics]}
          entities={this.entities}>
          <StatusBar hidden={true} />
        </GameEngine>
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
})