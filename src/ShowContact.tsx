// ShowContact.tsx
import * as React from "react"
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {createNote, createReminder, deleteNote, deleteReminder} from '@/controllers/crud';
import Markdown from 'react-markdown'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Input } from './components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

import { addDays, format } from "date-fns"
 
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
}

interface Note {
  ID: number;
  ContactId: number;
  Date: string;
  Content: string;
  Title: string;
}

interface Reminder {
  ID: number;
  ContactId: number;
  Date: string;
  Todo: string;
  Status: string;
  Title: string;
}


const ShowContact = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [contact, setContact] = useState<Contact | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isDeleteContact, setIsDeleteContact] = useState<number>(0);
  const [isDeleteNote, setIsDeleteNote] = useState<number>(0);
  const [isDeleteReminder, setIsDeleteReminder] = useState<number>(0);
  const [content, setContent] = useState('Note...');
  const [title, setTitle] = useState('Note title');
  const [todo, setTodo] = useState("Todo...");
  const [reminderTitle, setReminderTitle] = useState("Reminder title");
  const [date, setDate] = React.useState<Date>();

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTodoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTodo(e.target.value);
  };

  const handleReminderTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReminderTitle(e.target.value);
  };

  const handleSubmitNote = () => {
    const contactId = contact?.ID;
    createNote(contactId, title, content);
    const now = new Date();
    const formattedDate = now.toISOString();
    toast({
      duration: 2500,
      title: "New note created",
      description: formattedDate,
    })
  };

  const handleSubmitReminder = () => {
    const contactId = contact?.ID;
    createReminder(contactId, reminderTitle, todo, date);
    const now = new Date();
    const formattedDate = now.toISOString();
    toast({
      duration: 2500,
      title: "New reminder created",
      description: formattedDate,
    })
  };

  const handleDeleteNote = (noteId:number|undefined) => {
    deleteNote(noteId);
    setIsDeleteNote(1);
  }

  const handleDeleteReminder = (reminderId:number|undefined) => {
    deleteReminder(reminderId);
    setIsDeleteReminder(1);
  }

  const { toast } = useToast()

  useEffect(() => {
    // Fetch contact details
    fetch(`http://0.0.0.0:3000/api/contact/${id}`)
      .then(response => response.json())
      .then(data => setContact(data.contact))
      .catch(error => console.error('Error fetching contact details:', error));

    // Fetch contact notes
    fetch(`http://0.0.0.0:3000/api/note/contact/${id}`)
      .then(response => response.json())
      .then(data => setNotes(data.notes))
      .catch(error => console.error('Error fetching contact notes:', error));

    // Fetch contact reminders
    fetch(`http://0.0.0.0:3000/api/reminder/contact/${id}`)
      .then(response => response.json())
      .then(data => setReminders(data.reminders))
      .catch(error => console.error('Error fetching contact reminder:', error));

      if(isDeleteContact){
        fetch(`http://0.0.0.0:3000/api/contact/${id}`, {
          method: 'DELETE',
        })
          .then(() => {
            console.log('Contact deleted successfully!');
            navigate('/contacts');
            // Optionally, you can update the state or perform any other actions after successful deletion.
          })
          .catch(error => console.error('Error deleting contact:', error));
      }

      if(isDeleteNote){
        setIsDeleteReminder(0)
      }

      if(isDeleteReminder){
        setIsDeleteReminder(0)
      }

      
  }, [isDeleteContact, isDeleteNote, isDeleteReminder, id, navigate]);

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  
  

  return (
    <div className='grid gap-2 grid-cols-4'>
      <div className="col-span-2">
        <Card key={contact?.ID} className='w-full'>
            <CardHeader>
              <CardTitle>
                <h4 className="font-semibold mb-2">@{`${contact?.Name}.${contact?.LastName}`.toLowerCase()}</h4>
              </CardTitle>
              <CardDescription>{contact?.Email}</CardDescription>
              <CardContent className='text-left'>
                <p>{contact?.Name}</p>
                <p>{contact?.LastName}</p>
              </CardContent>
            </CardHeader>
        </Card>
      </div>
      <div className="col-span-1 text-left">
        <div className='pb-2'>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Contact</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure to delete {contact?.Name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the contact information.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => setIsDeleteContact(1)}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className='pb-2'>
          <Sheet>
            <SheetTrigger>
              <Button variant="outline">Create Note</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="sm:max-h-[800px]">
              <SheetHeader>
                <SheetTitle>Create Note</SheetTitle>
                <SheetDescription>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="title">
                      Title
                    </Label>
                    <Input id="title" placeholder="Note title" onChange={handleTitleChange} className="col-span-3"/>
                    <Label htmlFor="content">
                      Contact
                    </Label>
                    <Textarea id="content" placeholder="Type your message here." onChange={handleContentChange} className="col-span-3"/>
                    
                  </div>
                </SheetDescription>
              </SheetHeader>
              <SheetFooter className='py-10'>
                <SheetClose asChild>
                <Button onClick={handleSubmitNote} type="submit">Save changes</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        <div className='pb-2'>
          <Sheet>
            <SheetTrigger>
              <Button variant="outline">Create Reminder</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="sm:max-h-[800px]">
              <SheetHeader>
                <SheetTitle>Create Reminder</SheetTitle>
                <SheetDescription>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="title">
                        Title
                    </Label>
                    <Input id="title" placeholder="Reminder title" onChange={handleReminderTitleChange} className="col-span-3"/>
                    <Label htmlFor="todo">
                      Todo
                    </Label>
                    <Textarea id="todo" placeholder="Type your message here." onChange={handleTodoChange} className="col-span-3"/>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
                          {date ? format(date, "PPP") : <span>Date Reminder</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        className="flex w-auto flex-col space-y-2 p-2"
                      >
                        <Select
                          onValueChange={(value) =>
                            setDate(addDays(new Date(), parseInt(value)))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="0">Today</SelectItem>
                            <SelectItem value="1">Tomorrow</SelectItem>
                            <SelectItem value="3">In 3 days</SelectItem>
                            <SelectItem value="7">In a week</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="rounded-md border">
                          <Calendar mode="single" selected={date} onSelect={setDate} />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </SheetDescription>
              </SheetHeader>
              <SheetFooter className='py-10'>
                <SheetClose asChild>
                <Button onClick={handleSubmitReminder} type="submit">Save changes</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="col-span-4 py-5">
        <div className='py-10'>
        <Separator />
        </div>
        <Tabs defaultValue="notes" className="text-left">
          <TabsList>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
          </TabsList>
          <TabsContent value="reminders">
          <Accordion type="single" collapsible>
        {reminders.map(reminder => (
          <AccordionItem value={reminder.ID.toString()}>
          <AccordionTrigger>{reminder.Title} - {formatDate(reminder.Date)}</AccordionTrigger>
          <AccordionContent>
            <div className='grid gap-2 lg:grid-cols-8 sm:grid-cols-1 mt-6'>
              <div className='text-left lg:border p-8 lg:border-gray-300 rounded lg:col-span-6 sm:col-span-8'>
              
              <Markdown className="markdown-render">{ reminder.Todo}</Markdown>
              </div>
              <div className='lg:col-span-2 sm:col-span-8'>
                <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Reminder</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure to delete this reminder?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the reminder.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteReminder(reminder.ID)}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              </div>
            </div>
          </AccordionContent>
          </AccordionItem>
        ))}
        </Accordion>
          </TabsContent>
          <TabsContent value="notes">
          <Accordion type="single" collapsible>
        {notes.map(note => (
          <AccordionItem value={note.ID.toString()}>
          <AccordionTrigger>{note.Title} - {formatDate(note.Date)}</AccordionTrigger>
          <AccordionContent>
            <div className='grid gap-2 lg:grid-cols-8 sm:grid-cols-1 mt-6'>
              <div className='text-left lg:border p-8 lg:border-gray-300 rounded lg:col-span-6 sm:col-span-8'>
              
              <Markdown className="markdown-render">{ note.Content}</Markdown>
              </div>
              <div className='lg:col-span-2 sm:col-span-8'>
                <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Note</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure to delete this note?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the note content.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteNote(note.ID)}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              </div>
            </div>
          </AccordionContent>
          </AccordionItem>
        ))}
        </Accordion>
          </TabsContent>
        </Tabs>
        <div className='text-left'>
        <Toaster />
        </div>
        
      </div>
    </div>
  );
};

export default ShowContact;
