import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Source } from "@/lib/chatbot/types"
import { SourceCard } from "@/components/chatbot/source-card"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface SourcesDialogProps {
  isOpen: boolean
  onClose: () => void
  sources: Source[]
  messageId: string
}

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SourcesDialog({ isOpen, onClose, sources, messageId }: SourcesDialogProps) {
  if (!sources || sources.length === 0) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto p-0 w-[calc(100%-2rem)] md:w-full rounded-2xl">
        <DialogHeader className="sticky top-0 z-50 px-6 py-4 border-b bg-white dark:bg-slate-900 rounded-t-2xl">
          <DialogTitle className="text-lg font-semibold tracking-tight pr-8">
            Sources
          </DialogTitle>
          <button
            onClick={onClose}
            className={cn(
              "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white",
              "transition-opacity hover:opacity-100 focus:outline-none focus:ring-2",
              "focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none",
              "data-[state=open]:bg-slate-100 dark:ring-offset-slate-950",
              "dark:focus:ring-slate-800 dark:data-[state=open]:bg-slate-800"
            )}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        
        <div className="px-6 py-4 space-y-6">
          {sources.map((source, index) => (
            <div key={source.id} className="space-y-2">
              <div className="flex items-center">
                <span className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium",
                  "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
                  "transition-colors duration-200"
                )}>
                  {index + 1}
                </span>
              </div>
              <SourceCard source={source} />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 