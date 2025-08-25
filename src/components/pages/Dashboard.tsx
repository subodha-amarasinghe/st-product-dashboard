import React, { useState, useEffect, useCallback, useMemo } from "react";
import { CssBaseline, Box } from "@mui/material";
import AppHeader from "../common/AppHearder";
import Sidebar from "../common/Sidebar";
import DashboardContainer from "../dashboard/DashboardContainer";
import FilterBar from "../dashboard/FilterBar";
import { Category, Product } from "../../types/dashboard";
import { fetchCategories, fetchProducts } from "../../api/dashboard";

const Dashboard: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await fetchCategories();
        setCategories(categoryData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleDrawerToggle = useCallback(
    () => setMobileOpen((prev) => !prev),
    []
  );

  const handleSetSelectedProducts = useCallback(
    async (products: Product[], runReport: boolean) => {
      if (runReport) {
        // Added this logic to add timeout only for the "Run Report" Button click
        setMobileOpen(false);
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 3000);
        setSelectedProducts(products);
      } else {
        setSelectedProducts(products);
      }
    },
    []
  );

  const handleCategoryChange = useCallback(
    async (category: Category | null) => {
      setSelectedProducts([]);
      setSelectedCategory(category);
      if (category) {
        const productList = await fetchProducts(category.slug);
        setProducts(productList.products);
        setSelectedProducts(productList.products);
      }
    },
    []
  );

  const filterBarProps = useMemo(
    () => ({
      categories,
      selectedCategory,
      onChangeCategory: handleCategoryChange,
      products,
      selectedProducts,
      onSelectSelectedProducts: handleSetSelectedProducts,
    }),
    [
      categories,
      selectedCategory,
      products,
      selectedProducts,
      handleCategoryChange,
      handleSetSelectedProducts,
    ]
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* App Header */}
      <AppHeader title="Product Dashboard" onMenuClick={handleDrawerToggle} />

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle}>
        <FilterBar {...filterBarProps} />
      </Sidebar>

      {/* Main Content */}
      <DashboardContainer
        selectedCategory={selectedCategory}
        loading={loading}
        products={selectedProducts}
        categories={categories}
      />
    </Box>
  );
};

export default React.memo(Dashboard);
