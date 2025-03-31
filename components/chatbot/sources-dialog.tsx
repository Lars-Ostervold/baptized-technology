import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Source } from "@/lib/chatbot/types"
import { SourceCard } from "@/components/chatbot/source-card"
import { cn } from "@/lib/utils"

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
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Sources
          </DialogTitle>
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