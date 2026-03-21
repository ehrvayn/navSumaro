import { useState } from "react";
import { Group } from "../../types";
import { Search, Users, } from "lucide-react";
import { useGroup } from "../../context/GroupContex";
import { FaLock } from "react-icons/fa6";
import { BsGlobeAmericasFill } from "react-icons/bs";

interface DiscoverGroupsProps {
  groups: Group[];
}

const DiscoverGroups: React.FC<DiscoverGroupsProps> = ({ groups }) => {
  const [search, setSearch] = useState("");
  const { setActiveGroupId, setJoined, setActiveTab } = useGroup();

  const results = groups.filter(
    (g) =>
      !g.joined && 
      (search === "" ||
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))),
  );

  const handleJoin = (groupId: string) => {
    setJoined(true, groupId);
    setActiveGroupId(groupId);
    setActiveTab("Posts");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search groups by name or tag..."
          className="input-base w-full pl-10"
        />
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        />
      </div>

      {results.length === 0 ? (
        <p className="text-center text-text-muted text-sm mt-8">
          {search ? "No groups found" : "No groups to discover"}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {results.map((g) => (
            <div
              key={g.id}
              className="bg-base-surface border border-border rounded-md p-4 flex items-center gap-4"
            >
              <div className="text-3xl shrink-0">{g.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-text-primary truncate">
                    {g.name}
                  </span>
                  {g.isPublic ? (
                    <BsGlobeAmericasFill size={12} className="text-text-muted shrink-0" />
                  ) : (
                    <FaLock size={12} className="text-text-muted shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-text-muted line-clamp-1 mb-2">
                  {g.description}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-text-muted flex items-center gap-1">
                    <Users size={11} /> {g.members.length} members
                  </span>
                  <div className="flex gap-1 flex-wrap">
                    {g.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-brand/10 text-brand px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleJoin(g.id)}
                className="shrink-0 px-3 py-1.5 rounded-md text-[11px] font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              >
                Join
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscoverGroups;