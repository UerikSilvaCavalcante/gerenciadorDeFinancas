"use client";

import { CardComponent } from "../components/cardComponent";
import React from "react";
import { List } from "react-window";
import { type RowComponentProps } from "react-window";
import {
  TransferMounth,
  TransferDay,
  Trasnsfer,
} from "../components/trasnfersByMounth";

type dataProps = {
  mounth: number;
  trasnsfers: {
    day: string;
    valueTot: number;
    trasnfer: {
      desc: string;
      methood: string;
      type: number;
      value: number;
    }[];
  }[];
};

type RowProps = {
  data: dataProps[];
};

export default function Test() {
  const data: dataProps[] = [
    {
      mounth: 1,
      trasnsfers: [
        {
          day: "2025-07-22",
          valueTot: 100,
          trasnfer: [
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 0,
              value: 100,
            },
          ],
        },
        {
          day: "2025-07-24",
          valueTot: 100,
          trasnfer: [
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 2,
              value: 100,
            },
          ],
        },
      ],
    },
    {
      mounth: 2,
      trasnsfers: [
        {
          day: "2025-07-30",
          valueTot: 300,
          trasnfer: [
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 0,
              value: 150,
            },
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 4,
              value: 150,
            },
          ],
        },
        {
          day: "2025-07-02",
          valueTot: 50,
          trasnfer: [
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 3,
              value: 50,
            },
          ],
        },
        {
          day: "2025-07-02",
          valueTot: 50,
          trasnfer: [
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 3,
              value: 50,
            },
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 3,
              value: 50,
            },
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 3,
              value: 50,
            },
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 3,
              value: 50,
            },
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 3,
              value: 50,
            },
          ],
        },
      ],
    },
    {
      mounth: 1,
      trasnsfers: [
        {
          day: "2025-07-22",
          valueTot: 100,
          trasnfer: [
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 0,
              value: 100,
            },
          ],
        },
        {
          day: "2025-07-24",
          valueTot: 100,
          trasnfer: [
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 2,
              value: 100,
            },
          ],
        },
      ],
    },
    {
      mounth: 1,
      trasnsfers: [
        {
          day: "2025-07-22",
          valueTot: 100,
          trasnfer: [
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 0,
              value: 100,
            },
          ],
        },
        {
          day: "2025-07-24",
          valueTot: 100,
          trasnfer: [
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 2,
              value: 100,
            },
          ],
        },
      ],
    },
    {
      mounth: 2,
      trasnsfers: [
        {
          day: "2025-07-30",
          valueTot: 300,
          trasnfer: [
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 0,
              value: 150,
            },
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 4,
              value: 150,
            },
          ],
        },
        {
          day: "2025-07-02",
          valueTot: 50,
          trasnfer: [
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 3,
              value: 50,
            },
          ],
        },
        {
          day: "2025-07-02",
          valueTot: 50,
          trasnfer: [
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 3,
              value: 50,
            },
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 3,
              value: 50,
            },
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 3,
              value: 50,
            },
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 3,
              value: 50,
            },
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 3,
              value: 50,
            },
          ],
        },
      ],
    },
    {
      mounth: 1,
      trasnsfers: [
        {
          day: "2025-07-22",
          valueTot: 100,
          trasnfer: [
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 0,
              value: 100,
            },
          ],
        },
        {
          day: "2025-07-24",
          valueTot: 100,
          trasnfer: [
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 2,
              value: 100,
            },
          ],
        },
      ],
    },
    {
      mounth: 1,
      trasnsfers: [
        {
          day: "2025-07-22",
          valueTot: 100,
          trasnfer: [
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 0,
              value: 100,
            },
          ],
        },
        {
          day: "2025-07-24",
          valueTot: 100,
          trasnfer: [
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 2,
              value: 100,
            },
          ],
        },
      ],
    },
    {
      mounth: 2,
      trasnsfers: [
        {
          day: "2025-07-30",
          valueTot: 300,
          trasnfer: [
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 0,
              value: 150,
            },
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 4,
              value: 150,
            },
          ],
        },
        {
          day: "2025-07-02",
          valueTot: 50,
          trasnfer: [
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 3,
              value: 50,
            },
          ],
        },
        {
          day: "2025-07-02",
          valueTot: 50,
          trasnfer: [
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 3,
              value: 50,
            },
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 3,
              value: 50,
            },
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 3,
              value: 50,
            },
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 3,
              value: 50,
            },
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 3,
              value: 50,
            },
          ],
        },
      ],
    },
    {
      mounth: 1,
      trasnsfers: [
        {
          day: "2025-07-22",
          valueTot: 100,
          trasnfer: [
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 0,
              value: 100,
            },
          ],
        },
        {
          day: "2025-07-24",
          valueTot: 100,
          trasnfer: [
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 2,
              value: 100,
            },
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 2,
              value: 100,
            },
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 2,
              value: 100,
            },
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 2,
              value: 100,
            },
            {
              desc: "desc 1",
              methood: "methood 1",
              type: 2,
              value: 100,
            },
          ],
        },
      ],
    },
  ];

  const Row = ({ index, style, data }: RowComponentProps<RowProps>) => {
    return (
      <div
        className="w-full flex flex-row justify-center items-center"
        key={index}
        style={style}
      >
        <TransferMounth mounth={data[index].mounth}>
          {data[index].trasnsfers.map((trasnfer, index) => (
            <div
              key={index}
              className="w-full flex flex-col justify-start items-start"
            >
              <TransferDay date={trasnfer.day} valueTot={trasnfer.valueTot} />
              {trasnfer.trasnfer.map((transfer, index) => (
                <Trasnsfer
                  key={index}
                  value={transfer.value}
                  desc={transfer.desc}
                  methood={transfer.methood}
                  type={transfer.type}
                />
              ))}
            </div>
          ))}
        </TransferMounth>
      </div>
    );
  };

  const rowHeight = (index: number, { data }: RowProps) => {
    const trasnfer = data[index].trasnsfers;
    const trasnferHeight = trasnfer.length;
    const day = trasnfer.flatMap((d) => d.trasnfer);
    const dayHeight = day.length;
    return 32 + (trasnferHeight * 32 )+ (dayHeight * 60);
  };

  return (
    <div className="flex flex-col h-screen w-screen justify-center items-center bg-zinc-200 ">
      <div className="w-1/2 h-[500px] overflow-y-scroll  bg-zinc-50 drop-shadow-2xl rounded-2xl justify-center items-center">
        <List
          rowComponent={Row}
          rowCount={data.length}
          rowProps={{ data }}
          rowHeight={rowHeight}
        />
      </div>
    </div>
  );
}
