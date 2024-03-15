// ListContactView.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


interface Contact {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  Name: string;
  LastName: string;
  Email: string;
  Phone: string;
  LinkedIn: string;
  IsUser: boolean;
  Group: string;
}

function ListContactView() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filterGroup, setFilterGroup] = useState("");

  useEffect(() => {
    // Fetch data from the backend API
    fetch('http://0.0.0.0:3000/api/contact')
      .then(response => response.json())
      .then(data => setContacts(data.contacts))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const badgeRender = (isUser: boolean) => {
    if(isUser){
      return <Badge>user</Badge>
    }
  }

  const filteredContacts = contacts.filter(contact => {
    // Check if there's a filter applied
    if (!filterGroup || filterGroup == "✨ All") return true; // Show all contacts if no filter
  
    // Check if contact group matches the filter
    return contact.Group.toLowerCase() === filterGroup.toLowerCase();
  });

  const handleFilter = (e) => {
    console.log(e)
    setFilterGroup(e)
  }

  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Select onValueChange={handleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="✨ All">✨ All</SelectItem>
            <SelectItem value="🦄 Founder">🦄 Founder</SelectItem>
            <SelectItem value="💻 Software Engineer">💻 Software Engineer</SelectItem>
            <SelectItem value="🤓 Data Engineer">🤓 Data Engineer</SelectItem>
          </SelectContent>
        </Select>
        {filteredContacts.map(contact => (
          <Card key={contact.ID}>
          <CardHeader>
          <div className="grid gap-2 grid-cols-4">
              <Avatar>
                <AvatarFallback>{contact.Name[0].toUpperCase()}{contact.LastName[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <Link to={`/contact/${contact.ID}`} className="text-mygreen hover:underline">
                <h4 className="font-semibold mb-2">@{`${contact.Name}.${contact.LastName}`.toLowerCase()}</h4>
              </Link>
          </div>
          </CardHeader>
          <CardDescription>
            <div className="grid gap-2 grid-cols-4 pb-4">
              <div className='col-span-4'>{contact.Email}</div>
              <div className='col-span-4'>{badgeRender(contact.IsUser)}</div>
              <div className='col-span-4'>{contact.Group}</div>
            </div>
          </CardDescription>
        </Card>
        
        ))}
      </div>
    </>
  );
}

export default ListContactView;
