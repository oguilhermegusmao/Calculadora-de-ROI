import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { MadeWithDyad } from "@/components/made-with-dyad";

const RoiCalculator = () => {
  const [adSpend, setAdSpend] = useState<number | null>(null);
  const [productPrice, setProductPrice] = useState<number | null>(null);
  const [numberOfSales, setNumberOfSales] = useState<number | null>(null);
  const [cogs, setCogs] = useState<number | null>(null); // Cost of Goods Sold
  const [isRoasMode, setIsRoasMode] = useState<boolean>(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const { totalRevenue, grossProfit, roi, cpa, roas } = useMemo(() => {
    const currentAdSpend = adSpend || 0;
    const currentProductPrice = productPrice || 0;
    const currentNumberOfSales = numberOfSales || 0;
    const currentCogs = cogs || 0;

    const revenue = currentProductPrice * currentNumberOfSales;
    const profit = revenue - currentAdSpend;
    const profitRoas = revenue - currentAdSpend - (currentCogs * currentNumberOfSales);

    const calculatedRoi = currentAdSpend > 0 ? (profit / currentAdSpend) : 0;
    const calculatedCpa = currentNumberOfSales > 0 ? currentAdSpend / currentNumberOfSales : 0;
    const calculatedRoas = (currentAdSpend + (currentCogs * currentNumberOfSales)) > 0 ? revenue / (currentAdSpend + (currentCogs * currentNumberOfSales)) : 0;

    return {
      totalRevenue: revenue,
      grossProfit: isRoasMode ? profitRoas : profit,
      roi: calculatedRoi,
      cpa: calculatedCpa,
      roas: calculatedRoas,
    };
  }, [adSpend, productPrice, numberOfSales, cogs, isRoasMode]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-app-background p-4">
      <Card className="w-full max-w-2xl bg-white shadow-lg rounded-lg">
        <CardHeader className="flex flex-col items-center space-y-4 p-6 bg-app-background rounded-t-lg">
          <img src="/metodo-raiz-logo.png" alt="Método Raiz Logo" className="h-24 w-auto" />
          <CardTitle className="text-3xl font-bold text-app-accent">Calculadora de ROI/ROAS</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Toggle ROAS Mode */}
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="roas-mode" className="text-lg font-medium text-gray-700">
              Calcular ROAS (incluir CMV)
            </Label>
            <Switch
              id="roas-mode"
              checked={isRoasMode}
              onCheckedChange={setIsRoasMode}
              className="data-[state=checked]:bg-app-accent data-[state=unchecked]:bg-gray-300"
            />
          </div>

          <Separator />

          {/* Input Fields */}
          <h2 className="text-xl font-semibold text-gray-800">Parte 1: Campos de Entrada</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ad-spend" className="text-sm font-medium text-gray-600">
                Investimento Total em Anúncios (R$)
              </Label>
              <Input
                id="ad-spend"
                type="number"
                value={adSpend === null ? "" : adSpend}
                onChange={(e) => setAdSpend(e.target.value === "" ? null : parseFloat(e.target.value))}
                placeholder="Ex: 500.00"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-app-accent focus:ring-app-accent"
              />
            </div>
            <div>
              <Label htmlFor="product-price" className="text-sm font-medium text-gray-600">
                Preço do Produto/Serviço Vendido (R$)
              </Label>
              <Input
                id="product-price"
                type="number"
                value={productPrice === null ? "" : productPrice}
                onChange={(e) => setProductPrice(e.target.value === "" ? null : parseFloat(e.target.value))}
                placeholder="Ex: 2000.00"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-app-accent focus:ring-app-accent"
              />
            </div>
            <div>
              <Label htmlFor="number-of-sales" className="text-sm font-medium text-gray-600">
                Número de Vendas Realizadas
              </Label>
              <Input
                id="number-of-sales"
                type="number"
                value={numberOfSales === null ? "" : numberOfSales}
                onChange={(e) => setNumberOfSales(e.target.value === "" ? null : parseInt(e.target.value))}
                placeholder="Ex: 3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-app-accent focus:ring-app-accent"
              />
            </div>
            {isRoasMode && (
              <div>
                <Label htmlFor="cogs" className="text-sm font-medium text-gray-600">
                  Custo de Mercadoria Vendida (CMV) por Unidade (R$)
                </Label>
                <Input
                  id="cogs"
                  type="number"
                  value={cogs === null ? "" : cogs}
                  onChange={(e) => setCogs(e.target.value === "" ? null : parseFloat(e.target.value))}
                  placeholder="Ex: 100.00"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-app-accent focus:ring-app-accent"
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Output Fields */}
          <h2 className="text-xl font-semibold text-gray-800">Parte 2: Campos de Saída</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-600">Faturamento Total (R$)</span>
              <span className="text-lg font-bold text-app-accent">{formatCurrency(totalRevenue)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-600">Lucro Bruto (R$)</span>
              <span className="text-lg font-bold text-app-accent">{formatCurrency(grossProfit)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-600">ROI (Retorno Sobre o Investimento)</span>
              <span className="text-lg font-bold text-app-accent">
                {roi.toFixed(2)}x ou {(roi * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-600">CPA (Custo por Aquisição de Cliente)</span>
              <span className="text-lg font-bold text-app-accent">{formatCurrency(cpa)}</span>
            </div>
            {isRoasMode && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-600">ROAS (Retorno Sobre o Gasto com Anúncios)</span>
                <span className="text-lg font-bold text-app-accent">{roas.toFixed(2)}x</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Interpretation */}
          <h3 className="text-lg font-semibold text-gray-800">Interpretação:</h3>
          <p className="text-gray-700">
            ROI de {roi.toFixed(2)}x: Para cada {formatCurrency(1.00)} investido em anúncios, retornaram {formatCurrency(roi * 1.00)} de lucro.
          </p>
          <p className="text-gray-700">
            CPA de {formatCurrency(cpa)}: Custou {formatCurrency(cpa)} em anúncios para conseguir cada novo cliente de {formatCurrency(productPrice)}.
          </p>
          {isRoasMode && (
            <p className="text-gray-700">
              ROAS de {roas.toFixed(2)}x: Para cada {formatCurrency(1.00)} gasto em anúncios e CMV, retornaram {formatCurrency(roas * 1.00)} de faturamento.
            </p>
          )}
        </CardContent>
      </Card>
      <MadeWithDyad />
    </div>
  );
};

export default RoiCalculator;