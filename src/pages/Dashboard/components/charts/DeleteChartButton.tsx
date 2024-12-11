import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, X } from 'lucide-react';
import useDeleteChart from '@/api/hooks/useDeleteChart';
import { useQueryClient } from '@tanstack/react-query'; // For cache invalidation and real-time UI update

interface DeleteChartButtonProps {
  dashboard_id: string; // Assuming the dashboard ID is passed as a prop
  chart_id: string;     // Assuming the chart ID is passed as a prop
  onDeleteSuccess: () => void; // Callback to trigger on success
}

const DeleteChartButton: React.FC<DeleteChartButtonProps> = ({
  dashboard_id,
  chart_id,
  onDeleteSuccess,
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const queryClient = useQueryClient(); // Query Client for cache management

  // Debugging: log the values received as props
  console.log('Dashboard ID:', dashboard_id);
  console.log('Chart ID:', chart_id);

  // Use the hook to handle the chart deletion
  const { mutate: deleteChart, isLoading, isError } = useDeleteChart({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-charts', dashboard_id] }); // Invalidate the charts query to update UI
      onDeleteSuccess();  // Trigger onSuccess callback to refresh the UI or update the parent component
      setShowDialog(false);  // Close the modal after deletion
    },
    onError: (error) => {
      console.error('Error deleting chart:', error);
    }
  });

  const handleDelete = () => {
    console.log('Attempting to delete chart with ID:', chart_id, 'from dashboard:', dashboard_id);

    // Ensure the dashboard_id and chart_id are valid before calling the mutation
    if (!dashboard_id || !chart_id) {
      console.error('Error: dashboard_id or chart_id is missing');
      return; // Return early if IDs are invalid
    }

    deleteChart({ dashboard_id, chart_id }); // Trigger the deletion
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-400 bg-secondary-background hover:text-red-500"
        onClick={() => setShowDialog(true)} // Show modal on button click
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      {/* Backdrop and Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primary-background border border-[#3D494A] rounded-lg w-full max-w-md p-6 shadow-xl relative">
            {/* Close Button */}
            <button
              onClick={() => setShowDialog(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Delete Chart</h3>
              <p className="text-gray-400">
                Are you sure you want to delete this chart? This action cannot be undone.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              {/* Cancel Button */}
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 bg-secondary-background hover:bg-secondary-background/90"
                onClick={() => setShowDialog(false)} // Close modal without deletion
              >
                Cancel
              </Button>

              {/* Delete Button */}
              <Button
                variant="ghost"
                size="sm"
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
                disabled={isLoading} // Disable button when deletion is pending
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </div>

            {/* Error message */}
            {isError && (
              <div className="mt-4 text-red-500">
                <p>Error deleting chart. Please try again.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteChartButton;
