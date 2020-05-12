import Matter from 'matter-js';

const Physics = (entities, { touches, time }) => {
  let engine = entities.physics.engine;
  let bird = entities.bird.body;

  //タッチ処理
  touches.filter(t => t.type === "press").forEach(t => {
    Matter.Body.applyForce(
      bird,
      bird.position,
      {
        x: 0.00,
        y: -0.10
      }
    )
  })

  Matter.Engine.update(engine, time.delta);

  return entities;
}

export default Physics;