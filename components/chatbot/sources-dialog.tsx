import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Source } from "@/lib/chatbot/types"
import { SourceCard } from "@/components/chatbot/source-card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface SourcesDialogProps {
  isOpen: boolean
  onClose: () => void
  sources: Source[]
  messageId: string
}

export function SourcesDialog({ isOpen, onClose, sources, messageId }: SourcesDialogProps) {
  if (!sources || sources.length === 0) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>All Sources</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={18} />
            </Button>
          </DialogClose>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {sources.map((source, index) => (
            <div key={source.id} className="space-y-1">
              <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-xs font-semibold">
                  {index + 1}
                </span>
                Citation [{index + 1}]
              </div>
              <SourceCard source={source} />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 