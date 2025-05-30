import React, { useState } from 'react';
import 'rsuite/dist/rsuite.min.css';
import { GuestGroup } from '../types/interfaces';

interface GuestTableProps {
  guestGroups: GuestGroup[];
  onAddGuestGroup: () => void;
  onGenerateRsvpCode: (groupId: string) => void;
}

const GuestTable: React.FC<GuestTableProps> = ({
  guestGroups,
  onAddGuestGroup,
  onGenerateRsvpCode
}) => {
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());

  const getBusCounts = (group: GuestGroup) => {
    const bus1630 = group.guests.filter(g => g.busTime === '16:30').length;
    const bus1700 = group.guests.filter(g => g.busTime === '17:00').length;
    const total = bus1630 + bus1700;
    return { bus1630, bus1700, total };
  };

  const toggleGroupSelection = (groupId: string) => {
    const newSelected = new Set(selectedGroups);
    if (newSelected.has(groupId)) {
      newSelected.delete(groupId);
    } else {
      newSelected.add(groupId);
    }
    setSelectedGroups(newSelected);
  };

  const selectAllSelectable = () => {
    const selectableGroups = guestGroups.filter(group => !group.rsvpCode).map(group => group.id);
    setSelectedGroups(new Set(selectableGroups));
  };

  const generateLinksForSelected = () => {
    selectedGroups.forEach(groupId => {
      onGenerateRsvpCode(groupId);
    });
    setSelectedGroups(new Set());
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            onClick={onAddGuestGroup}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Add Guest Group
          </button>
          <button
            onClick={selectAllSelectable}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Select All Selectable
          </button>
          {selectedGroups.size > 0 && (
            <button
              onClick={generateLinksForSelected}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Generate Links for Selected ({selectedGroups.size})
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-8 p-2 border-b"></th>
              <th className="p-2 text-left border-b">Group Name</th>
              <th className="p-2 text-left border-b">Contact</th>
              <th className="p-2 text-left border-b">Guests</th>
              <th className="p-2 text-left border-b bg-blue-50">RSVP Link</th>
              <th className="p-2 text-left border-b bg-blue-50">Status</th>
              <th className="p-2 text-left border-b bg-blue-50">Bus Requests</th>
            </tr>
          </thead>
          <tbody>
            {guestGroups.map((group) => {
              const { bus1630, bus1700, total } = getBusCounts(group);
              const totalComing = group.guests.filter(g => g.coming).length;
              
              return (
                <tr 
                  key={group.id}
                  className={`hover:bg-gray-50 ${selectedGroups.has(group.id) ? 'bg-blue-50' : ''}`}
                >
                  <td className="p-2 border-b">
                    <input
                      type="checkbox"
                      checked={selectedGroups.has(group.id)}
                      onChange={() => toggleGroupSelection(group.id)}
                      disabled={!!group.rsvpCode}
                      className={`rounded ${group.rsvpCode ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                  </td>
                  <td className="p-2 text-left border-b">{group.groupInvite}</td>
                  <td className="p-2 text-left border-b">{group.contact}</td>
                  <td className="p-2 text-left border-b">
                    <ul className="list-disc list-inside">
                      {group.guests.map((guest, index) => (
                        <li key={index} className="text-sm">
                          {guest.fullName}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-2 border-b text-left bg-blue-50">
                    {group.rsvpCode ? (
                      <a 
                        href={"/?code=" + group.rsvpCode}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {"/?code=" + group.rsvpCode}
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-2 border-b text-left bg-blue-50">
                    {group.guests.some(g => g.coming !== undefined) ? (
                      <div>
                        Coming: {totalComing} / {group.guests.length}
                      </div>
                    ) : (
                      <span className="text-gray-400">NA</span>
                    )}
                  </td>
                  <td className="p-2 border-b text-left bg-blue-50">
                    {group.guests.some(g => g.busTime !== undefined) ? (
                      <div className="text-sm">
                        <div>Total: {total} / {totalComing}</div>
                        {total > 0 && (
                          <div className="text-gray-600">
                            <div>16:30: {bus1630}</div>
                            <div>17:00: {bus1700}</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">NA</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuestTable; 