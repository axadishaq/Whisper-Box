import {
   Card,
   CardContent,
   CardFooter,
} from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Message } from "@/models/user.model";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

type MessageCardProp = {
   message: Message;
   onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProp) {
   const handleDeleteConfirm = async () => {
      try {
         const response = await axios.delete<ApiResponse>(
            `/api/messages/delete-message?messageId=${message._id}`
         );
         toast.success(response.data.message);
         onMessageDelete(message._id as string);
      } catch (error) {
         console.log("Error deleting message", error);
         toast.error("Error deleting message");
      }
   };

   return (
      <Card className="w-full max-w-md">
         <CardContent className="flex gap-2 justify-between">
            <p className="text-sm mb-2">
               {message.content}
            </p>
            <AlertDialog>
               <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon" className="mt-2 bg-red-500">
                     <Trash2 className="h-4 w-4" />
                  </Button>
               </AlertDialogTrigger>
               <AlertDialogContent>
                  <AlertDialogHeader>
                     <AlertDialogTitle>
                        Are you absolutely sure?
                     </AlertDialogTitle>
                     <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this message and remove it from your inbox.
                     </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                     <AlertDialogCancel>Cancel</AlertDialogCancel>
                     <AlertDialogAction onClick={handleDeleteConfirm}>
                        Delete
                     </AlertDialogAction>
                  </AlertDialogFooter>
               </AlertDialogContent>
            </AlertDialog>
         </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground">
               {format(new Date(message.createdAt), "PPpp")}
            </p>
         </CardFooter>
      </Card>
   );
}
