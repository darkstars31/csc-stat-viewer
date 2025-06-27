import React, { useState } from "react";
import { Container } from "../../common/components/container";
import { Input } from "../../common/components/forms/input";
import { useDataContext } from "../../DataContext";
import { usePlayerBadgeMutation } from "../../dao/analytikill";
import Select from "react-select";

export const AccoladeForm: React.FC = () => {
  const { players } = useDataContext();
  const playerBadgeMutation = usePlayerBadgeMutation();
  const [ error, setError ] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    player: "",
    season: "",
    badgeType: "",
    badgeText: "",
    badgeImageUrl: "",
    metadata: "",
  });

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const accolade = {
      ...formData,
      season: parseInt(formData.season, 10),
      badgeImageUrl: formData.badgeImageUrl || null,
      metadata: formData.metadata ? JSON.parse(formData.metadata) : null,
    };
    console.log("Submitted Accolade:", accolade);
    playerBadgeMutation.mutateAsync(accolade)
      .then(() => {
        setFormData({
          player: "",
          season: "",
          badgeType: "",
          badgeText: "",
          badgeImageUrl: "",
          metadata: "",
        });
      }).catch((error) => {
        console.error("Error submitting accolade:", error);
        setError("Failed to submit.");
      });
  };

  return (
    <Container>
        <h1 className="text-2xl font-bold mb-4">Add Player Accolade</h1>
    {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <label
                htmlFor="player"
                className="block text-sm font-medium text-gray-700"
            >
                Player:
            </label>
            <Select
                inputId="player"
                value={players.find((p) => p.id === formData.player) || null}
                onChange={(selected) =>
                setFormData((prev) => ({
                    ...prev,
                    player: selected ? (selected as { id: string }).id : "",
                }))
                }
                options={players}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                placeholder="Select a player"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                isClearable
            />
            </div>
            <div>
            <label
                htmlFor="season"
                className="block text-sm font-medium text-gray-700"
            >
                Season Number:
            </label>
            <Input
                type="number"
                id="season"
                value={formData.season}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
            />
            </div>
            <div>
            <label
                htmlFor="badgeType"
                className="block text-sm font-medium text-gray-700"
            >
                Badge Type:
            </label>
            <select
                id="badgeType"
                value={formData.badgeType}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
            >
                <option value="">Select a badge type</option>
                <option value="championship">Championship</option>
                <option value="all-star">All-Star</option>
                <option value="mvp">MVP</option>
                <option value="other">Other</option>
            </select>
            </div>
        </div>
        <div>
          <label
            htmlFor="badgeText"
            className="block text-sm font-medium text-gray-700"
          >
            Badge Text:
          </label>
          <textarea
            id="badgeText"
            value={formData.badgeText}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
          />
        </div>
        <div>
          <label
            htmlFor="badgeImageUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Badge Image URL:
          </label>
          <Input
            type="url"
            id="badgeImageUrl"
            value={formData.badgeImageUrl}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
          />
        </div>
        <div>
          <label
            htmlFor="metadata"
            className="block text-sm font-medium text-gray-700"
          >
            Metadata (JSON):
          </label>
          <textarea
            id="metadata"
            value={formData.metadata}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
    </Container>
  );
};
