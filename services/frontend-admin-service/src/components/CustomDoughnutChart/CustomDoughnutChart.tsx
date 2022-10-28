import { memo, useEffect, useRef } from 'react';
import {
    Chart,
    ChartData,
    ChartOptions,
    TooltipModel,
    TooltipItem,
    DoughnutController,
    ArcElement,
} from 'chart.js';
import { deepmerge } from 'deepmerge-ts';

import { CustomGrid } from 'shared-frontend/library';
import { ChartLegend } from '@components/ChartLegend/ChartLegend';

Chart.register([DoughnutController, ArcElement]);

type RenderTextPayload = {
    ctx: CanvasRenderingContext2D;
    font: string;
    text: string;
    width: number;
    height: number;
};

const renderText = ({ ctx, font, text, width, height }: RenderTextPayload) => {
    ctx.save();

    ctx.globalCompositeOperation = 'destination-over';

    const [, fontSize] = font.split(' ');
    ctx.font = font;
    const textMeasurement = ctx.measureText(text);

    ctx.fillText(
        text,
        width / 2 - textMeasurement.width / 2,
        height / 2 - parseInt(fontSize, 10) / 4,
    );

    ctx.restore();
};

const usersText = {
    id: 'chartUsersTextPlugin',
    beforeDraw: (chart: Chart, args, options) => {
        renderText({
            ctx: chart.ctx,
            font: `${options.fontWeight} ${options.fontSize}px Poppins`,
            text: options.text,
            width: chart.width,
            height: chart.height,
        });
    },
};

const totalText = {
    id: 'chartTotalTextPlugin',
    beforeDraw: (chart: Chart, args, options) => {
        renderText({
            ctx: chart.ctx,
            font: `${options.fontWeight} ${options.fontSize}px Poppins`,
            text: options.text,
            width: chart.width,
            height: chart.height + 50,
        });
    },
};

type CustomDoughnutChartProps = {
    label: string;
    className: string;
    width: string;
    height: string;
    data: {
        totalNumber: number;
        dataSets: {
            label: string;
            parts: number;
            color: string;
        }[];
    };
};

const defaultDataSetsSettings = {
    spacing: 12,
    borderRadius: 6,
    borderWidth: 0,
    hoverOffset: 10,
};

const defaultOptionsSettings = {
    cutout: '75%',
    radius: '100%',
    layout: {
        padding: {
            top: 0,
            left: 10,
            right: 10,
            bottom: 10,
        },
    },
    plugins: {
        title: {
            display: false,
        },
        legend: {
            labels: false,
        },
        subtitle: {
            display: false,
        },
        tooltip: {
            enabled: true,
            displayColors: false,
            titleAlign: 'center',
            cornerRadius: 12,
            backgroundColor: 'rgba(15, 15, 16, 0.6)',
            titleFont: {
                family: 'Poppins',
                size: 14,
                weight: 'bold',
            },
            padding: 16,
        },
        chartUsersTextPlugin: {
            fontSize: 16,
            fontWeight: 400,
        },
        chartTotalTextPlugin: {
            fontSize: 20,
            fontWeight: 600,
        },
    },
};

const Component = ({
    className,
    width,
    height,
    label,
    data: { totalNumber, dataSets },
}: CustomDoughnutChartProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<Chart | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            const data: ChartData<'doughnut'> = {
                labels: dataSets.map(dataSet => dataSet.label),
                datasets: [
                    deepmerge(defaultDataSetsSettings, {
                        label: label,
                        backgroundColor: dataSets.map(dataSet => dataSet.color),
                        data: dataSets.map(dataSet => dataSet.parts),
                    }),
                ],
            };

            const options = deepmerge<ChartOptions<'doughnut'>[]>(defaultOptionsSettings, {
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: (model: TooltipModel<'doughnut'>) => model[0]?.label,
                            label: (model: TooltipModel<'doughnut'>, item: TooltipItem<'doughnut'>): string | string[] => {
                                return `${Math.ceil((item.raw / totalNumber) * 100)}% - ${
                                    item.raw
                                }`;
                            },
                        },
                    },
                    chartUsersTextPlugin: {
                        text: label,
                    },
                    chartTotalTextPlugin: {
                        text: totalNumber.toString(10),
                    },
                },
            });

            chartRef.current = new Chart(canvas, {
                type: 'doughnut',
                data,
                options,
                plugins: [usersText, totalText],
            });

            chartRef.current.canvas.parentNode.style.height = height;
            chartRef.current.canvas.parentNode.style.width = width;
        }

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []);

    return (
        <CustomGrid container direction="column">
            <CustomGrid className={className}>
                <canvas ref={canvasRef} />
            </CustomGrid>
            <ChartLegend dataSets={dataSets} totalNumber={totalNumber} />
        </CustomGrid>
    );
};

export const CustomDoughnutChart = memo(Component);
