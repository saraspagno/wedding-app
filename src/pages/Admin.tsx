import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../types/firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import GuestTable from '../components/GuestTable';
import AddGuestForm from '../components/AddGuestForm';

interface Guest {
  id: string;
  name: string;
  lastName: string;
  numberOfPeople: number;
  phoneNumber: string;
  rsvpCode?: string;
  peopleComing?: number;
  peopleNeedingBus?: number;
  [key: string]: any; // Allow for dynamic properties
}

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddGuestFormOpen, setIsAddGuestFormOpen] = useState(false);

  const fetchGuests = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'guests'));
      const guestsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: '',
        lastName: '',
        numberOfPeople: 0,
        phoneNumber: '',
        ...doc.data()
      })) as Guest[];
      
      // Sort guests: those who haven't RSVP'd go to the bottom
      const sortedGuests = [...guestsData].sort((a, b) => {
        // If one has RSVP'd and the other hasn't, prioritize the one who has
        if (a.peopleComing !== undefined && b.peopleComing === undefined) return -1;
        if (a.peopleComing === undefined && b.peopleComing !== undefined) return 1;
        
        // If both have RSVP'd or both haven't, sort by name
        return `${a.name} ${a.lastName}`.localeCompare(`${b.name} ${b.lastName}`);
      });
      
      setGuests(sortedGuests);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleAddGuest = async (guestData: {
    name: string;
    lastName: string;
    numberOfPeople: number;
    phoneNumber: string;
  }) => {
    try {
      const docRef = await addDoc(collection(db, 'guests'), guestData);
      const newGuest = { ...guestData, id: docRef.id };
      setGuests([...guests, newGuest]);
    } catch (error) {
      console.error('Error adding guest:', error);
    }
  };

  const handleGenerateRsvpCode = async (guestId: string) => {
    try {
      // Check if guest already has an RSVP code
      const guest = guests.find(g => g.id === guestId);
      if (guest?.rsvpCode) {
        alert('This guest already has an RSVP code');
        return;
      }

      // Generate a unique RSVP code for the guest
      const rsvpCode = Math.random().toString(36).substring(2, 10);      
      await updateDoc(doc(db, 'guests', guestId), {
        rsvpCode
      });
      
      setGuests(guests.map(guest => 
        guest.id === guestId 
          ? { ...guest, rsvpCode }
          : guest
      ));
    } catch (error) {
      console.error('Error generating RSVP code:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Calculate statistics
  const totalInvited = guests.reduce((sum, guest) => sum + guest.numberOfPeople, 0);
  const totalComing = guests.reduce((sum, guest) => sum + (guest.peopleComing || 0), 0);
  const totalRsvps = guests
    .filter(guest => guest.peopleComing !== undefined)
    .reduce((sum, guest) => sum + guest.numberOfPeople, 0);
  const totalNotComing = totalRsvps - totalComing;
  const totalNeedingBus = guests.reduce((sum, guest) => sum + (guest.peopleNeedingBus || 0), 0);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-gray-800 m-0">Admin Dashboard</h1>
        <button 
          onClick={handleSignOut} 
          className="bg-red-600 hover:bg-red-700 text-white border-none py-2 px-4 rounded cursor-pointer transition-colors duration-200"
        >
          Sign Out
        </button>
      </div>

      <div className="flex flex-col gap-8">
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-gray-800 m-0 mb-4">Guest Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-gray-50 p-4 rounded text-center">
              <h3 className="text-gray-600 text-sm mb-2">Total People Invited</h3>
              <p className="text-2xl font-bold text-gray-800 m-0">{totalInvited}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded text-center">
              <h3 className="text-gray-600 text-sm mb-2">Total People Coming</h3>
              <p className="text-2xl font-bold text-gray-800 m-0">{totalComing}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded text-center">
              <h3 className="text-gray-600 text-sm mb-2">Total RSVPs</h3>
              <p className="text-2xl font-bold text-gray-800 m-0">{totalRsvps}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded text-center">
              <h3 className="text-gray-600 text-sm mb-2">Total Not Coming</h3>
              <p className="text-2xl font-bold text-gray-800 m-0">{totalNotComing}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded text-center">
              <h3 className="text-gray-600 text-sm mb-2">Total Needing Bus</h3>
              <p className="text-2xl font-bold text-gray-800 m-0">{totalNeedingBus}</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          {loading ? (
            <p>Loading guests...</p>
          ) : (
            <GuestTable
              guests={guests}
              onAddGuest={() => setIsAddGuestFormOpen(true)}
              onGenerateRsvpCode={handleGenerateRsvpCode}
            />
          )}
        </section>
      </div>

      <AddGuestForm
        isOpen={isAddGuestFormOpen}
        onClose={() => setIsAddGuestFormOpen(false)}
        onSubmit={handleAddGuest}
      />
    </div>
  );
};

export default Admin; 