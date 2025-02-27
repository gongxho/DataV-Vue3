/*
 * @Description: 请输入当前文件描述
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2022-12-06 17:17:00
 * @LastEditTime: 2022-12-07 11:35:08
 * @LastEditors: @Xin (834529118@qq.com)
 */
import { defineComponent } from 'vue';
import { useResize } from '../../hooks/useResize';
import { withInstall, mergeColor, calcTwoPointDistance } from '../../utils/common';
import { createDecoration5Props } from '../../utils/decoration';
export type { Decoration5Props } from '../../utils/decoration';
import { sum } from 'lodash-es';

import './index.less';
const defaultColor = ['#3f96a5', '#3f96a5'];

/**
 * @description: 获取多个点，每个点之间的距离
 * @param {Array<Array<number>>} points
 * @return {Array}
 */
const getPointDistances = (points: Array<Array<number>>) =>
  new Array(points.length - 1).fill(0).map((_, i) => calcTwoPointDistance(points[i], points[i + 1]));

export const Decoration5 = withInstall(
  defineComponent({
    name: 'Decoration5',

    props: createDecoration5Props(),

    setup(props) {
      const { domRef, domSize } = useResize();

      const calcSVGData = (width: number, height: number) => {
        const line1Points = [
          [0, height * 0.2],
          [width * 0.18, height * 0.2],
          [width * 0.2, height * 0.4],
          [width * 0.25, height * 0.4],
          [width * 0.27, height * 0.6],
          [width * 0.72, height * 0.6],
          [width * 0.75, height * 0.4],
          [width * 0.8, height * 0.4],
          [width * 0.82, height * 0.2],
          [width, height * 0.2],
        ];

        const line2Points = [
          [width * 0.3, height * 0.8],
          [width * 0.7, height * 0.8],
        ];

        return {
          line1Sum: sum(getPointDistances(line1Points)),
          line2Sum: sum(getPointDistances(line2Points)),
          line1Point: line1Points.map((point) => point.join(',')).join(' '),
          line2Point: line2Points.map((point) => point.join(',')).join(' '),
        };
      };

      return () => {
        const { width, height } = domSize;
        const { color, dur } = props;

        const mergedColor = mergeColor(defaultColor, color);

        const { line1Sum, line1Point, line2Point, line2Sum } = calcSVGData(width, height);

        return (
          <div class="dv-decoration-5" ref={domRef}>
            <svg width={width} height={height}>
              <polyline fill="transparent" stroke={mergedColor[0]} stroke-width="3" points={line1Point}>
                <animate
                  attributeName="stroke-dasharray"
                  attributeType="XML"
                  from={`0, ${line1Sum / 2}, 0, ${line1Sum / 2}`}
                  to={`0, 0, ${line1Sum}, 0`}
                  dur={`${dur}s`}
                  begin="0s"
                  calcMode="spline"
                  keyTimes="0;1"
                  keySplines="0.4,1,0.49,0.98"
                  repeatCount="indefinite"
                />
              </polyline>
              <polyline fill="transparent" stroke={mergedColor[1]} stroke-width="2" points={line2Point}>
                <animate
                  attributeName="stroke-dasharray"
                  attributeType="XML"
                  from={`0, ${line2Sum / 2}, 0, ${line2Sum / 2}`}
                  to={`0, 0, ${line2Sum}, 0`}
                  dur={`${dur}s`}
                  begin="0s"
                  calcMode="spline"
                  keyTimes="0;1"
                  keySplines=".4,1,.49,.98"
                  repeatCount="indefinite"
                />
              </polyline>
            </svg>
          </div>
        );
      };
    },
  })
);
