package cp317.greenthumb;

import android.content.Context;
import android.graphics.Bitmap;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageButton;
import android.widget.LinearLayout;

public class GalleryPhotoAdapter extends BaseAdapter{

    private Context context;
    private Bitmap[] photos;

    private LayoutInflater inflater;

    public GalleryPhotoAdapter(Context context, Bitmap[] photos) {
        this.context = context;
        this.photos = photos;
        inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    }

    @Override
    public int getCount() {
        return photos.length;
    }

    @Override
    public Object getItem(int position) {
        return position;
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(final int position, View convertView, ViewGroup parent) {

        View gridItem;

        if (convertView == null) {
            gridItem = inflater.inflate(R.layout.gallerygriditem, new LinearLayout(this.context));
            ImageButton imageButton = gridItem.findViewById(R.id.gridItemImage);
            imageButton.setImageBitmap(this.photos[position]);
            /*imageButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    // go to photo page
                }
            });*/
        } else {
            gridItem = convertView;
        }

        return gridItem;
    }
}
