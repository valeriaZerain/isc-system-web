import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, Typography } from "@mui/material";

interface AreaChartProps {
  data: {
    period: string;
    approved: number;
  }[];
  title: string; // Prop adicional para el título del gráfico
}

const AreaChartCard: React.FC<AreaChartProps> = ({ data, title }) => {
  return (
    <Card raised sx={{ margin: 2 }}>
      <CardContent>
        <Typography
          data-test-id="approved-students-by-period-message"
          variant="h6"
          component="div"
          gutterBottom
          sx={{
            fontWeight: "bold", // Aplica negrita
            color: "primary.main", // Utiliza el color primario definido en tu tema
            textAlign: "center", // Centra el texto
          }}
        >
          {title}
        </Typography>
        <ResponsiveContainer width="100%" height={100}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="approved"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AreaChartCard;
