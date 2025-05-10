import type { Plugin } from "vite";
import gradient from "gradient-string";
import { getPackageSize } from "./utils";
import dayjs, { type Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import boxen, { type Options as BoxenOptions } from "boxen";
dayjs.extend(duration);

const boxenOptions: BoxenOptions = {
  padding: 0.5,
  borderColor: "cyan",
  borderStyle: "round"
};

export function viteBuildInfo(): Plugin {
  let config: { command: string };
  let startTime: Dayjs;
  let endTime: Dayjs;
  let outDir: string;

  return {
    name: "vite:buildInfo",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      outDir = resolvedConfig.build?.outDir ?? "dist";
    },
    buildStart() {
      console.log(
        boxen(
          gradient(["cyan", "magenta"]).multiline(`啥都不要说，开撸`),
          boxenOptions
        )
      );

      if (config.command === "build") {
        startTime = dayjs(new Date());
      }
    },

    closeBundle() {
      if (config.command === "build") {
        endTime = dayjs(new Date());

        getPackageSize({
          folder: outDir,
          callback: (size: string) => {
            const time = endTime.diff(startTime);
            const timeUnit = time / 1000 > 60 ? "mm分ss秒" : "ss秒";

            console.log(
              boxen(
                gradient(["cyan", "magenta"]).multiline(
                  `🎉🎉🎉 打包成功！！！\n总用时${dayjs.duration(time).format(timeUnit)}，总体积${size}`
                ),
                boxenOptions
              )
            );
          }
        });
      }
    }
  };
}
