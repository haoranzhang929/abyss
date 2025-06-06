import { Effect, BlendFunction } from "postprocessing";
import { Uniform } from "three";

const fragmentShader = `
uniform float amount;

float bayer(vec2 pos) {
    int x = int(mod(pos.x, 4.0));
    int y = int(mod(pos.y, 4.0));
    int index = x + y * 4;
    float limit[16] = float[16](
        0.0, 8.0, 2.0, 10.0,
        12.0, 4.0, 14.0, 6.0,
        3.0, 11.0, 1.0, 9.0,
        15.0, 7.0, 13.0, 5.0
    );
    return (limit[index] + 0.5) / 16.0;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    float threshold = bayer(gl_FragCoord.xy);
    outputColor = vec4(floor(inputColor.rgb * amount + threshold) / amount, inputColor.a);
}
`;

export interface DitheringEffectOptions {
  blendFunction?: BlendFunction;
  amount?: number;
}

export class DitheringEffect extends Effect {
  constructor({ blendFunction = BlendFunction.NORMAL, amount = 4 }: DitheringEffectOptions = {}) {
    super("DitheringEffect", fragmentShader, {
      blendFunction,
      uniforms: new Map([["amount", new Uniform(amount)]])
    });
  }

  get amount(): number {
    return this.uniforms.get("amount")!.value as number;
  }

  set amount(value: number) {
    const uniform = this.uniforms.get("amount");
    if (uniform) {
      uniform.value = value;
    }
  }
}
