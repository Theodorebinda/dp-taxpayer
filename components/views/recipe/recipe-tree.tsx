"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/commons/operationViews.components";
import HttpClient from "@/utils/http-client";
import { LuExternalLink, LuRefreshCcw } from "react-icons/lu";
import { useRouter } from "next/navigation";
import Loader from "@/components/atoms/loader";

type TreeDataType = {
  id: string;
  description: string;
  name: string;
  pricing: string;
  payable: boolean;
  currency: { symbol: string };
  children: TreeDataType[];
};

type TreeNodeProps = {
  node: TreeDataType;
  level?: number;
  currentId: string;
};

const TreeNode = ({ node, level = 0, currentId }: TreeNodeProps) => {
  const isCurrentRecipe = currentId == node.id;
  const hasValidChildren =
    Array.isArray(node.children) &&
    node.children.length > 0 &&
    node.children.some((child) => Object.keys(child).length > 0);

  const router = useRouter();

  return (
    <div
      style={{ marginLeft: `${level * 1.5}rem` }}
      className="border-l border-foreground pl-4 mb-2"
    >
      <button
        onClick={() => router.push(`/view/core/recipe/${node.id}`)}
        className="group w-full flex justify-start text-left items-center cursor-pointer hover:bg-foreground/5 p-2 rounded-lg transition"
      >
        {!hasValidChildren && <span className="w-4 h-4 mr-2" />}

        <div className="flex flex-col w-full">
          <span className={`font-medium ${isCurrentRecipe && "text-primary"}`}>
            {node.name}{" "}
            {isCurrentRecipe && (
              <span className="font-normal"> (courant) </span>
            )}
          </span>
          {+node.pricing > 0 && (
            <span>
              {node.pricing} {node.currency?.symbol || "%"}
            </span>
          )}
          <span className="text-md text-foreground/60">
            {" "}
            <strong>Description :</strong> {node.description}
          </span>
        </div>
        {!isCurrentRecipe && (
          <LuExternalLink size={20} className="hidden group-hover:block" />
        )}
      </button>

      {hasValidChildren && (
        <div className="mt-2">
          {node.children.map(
            (child, index) =>
              Object.keys(child).length > 0 && (
                <TreeNode
                  key={index}
                  node={child}
                  level={level + 1}
                  currentId={currentId}
                />
              )
          )}
        </div>
      )}
    </div>
  );
};

const RecipeTree = ({ recipeId }: { recipeId: string }) => {
  const [data, setData] = useState<TreeDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<{
    code: number;
    message: string;
    [key: string]: any;
  } | null>(null);

  useEffect(() => {
    // Reset states quand recipeId change
    setLoading(true);
    setError(null);
    setData(null);

    const fetchData = async () => {
      try {
        const httpClient = new HttpClient();
        const response:
          | {
              code: number;
              message: string;
              data: any;
              meta?: any;
            }
          | false = await httpClient.get(
          `/read/recipe/recipe/${recipeId}/parent-tree`
        );

        if (!response) {
          setError(httpClient.error);
          return;
        }

        setData(response.data);
      } catch (err) {
        setError({
          code: 500,
          message: "Erreur lors du chargement des données",
          error: err,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [recipeId]); // Supprimer refresh des dépendances

  const handleRefresh = () => {
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const httpClient = new HttpClient();
        const response:
          | {
              code: number;
              message: string;
              data: any;
              meta?: any;
            }
          | false = await httpClient.get(
          `/read/recipe/recipe/${recipeId}/parent-tree`
        );

        if (!response) {
          setError(httpClient.error);
          return;
        }

        setData(response.data);
      } catch (err) {
        setError({
          code: 500,
          message: "Erreur lors du rafraîchissement",
          error: err,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  };

  const renderContent = () => {
    if (loading) {
      return <Loader />;
    }
    if (error) {
      return <div className="text-red-500">{error.message}</div>;
    }
    if (data) {
      return <TreeNode node={data} currentId={recipeId} />;
    }
    return (
      <p className="text-gray-500 text-sm text-center">
        Aucune donnée à afficher
      </p>
    );
  };

  return (
    <Card className="">
      <div className="flex justify-between items-center">
        <h2 className="font-medium text-lg">Arborescence de la recette</h2>
        <button
          onClick={handleRefresh}
          className="bg-background cursor-pointer rounded-lg p-3"
          disabled={loading}
        >
          <LuRefreshCcw className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      {renderContent()}
    </Card>
  );
};

export default RecipeTree;
